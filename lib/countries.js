const countryList = require('country-list')
const wiki = require('wikijs').default

const NodeCache = require('node-cache')
const cache = new NodeCache()
const constants = require('./constants')

// Get the countries in the format code : name
function getCountries(useCache) {
    let countries = !useCache ? undefined : cache.get('countries')
    if (countries !== undefined) {
        return {
            cached: true,
            countries: countries
        }
    }
    const nameList = countryList.getNameList()
    countries = Object.keys(nameList).map(key => {
        const code = nameList[key]
        const name = countryList.getName(code)
        return {
            [code]: name
        }
    })
    if (useCache) {
        setCountries(countries)
    }
    return {
        cached: false, //process.env.NODE_ENV === 'development' ? true : false,
        countries: countries
    }
}

function setCountries(countries) {
    cache.set('countries', countries, constants.CACHE_TIMEOUT)
}

// Gets the country name by countryCode
function getCountryByCode(countryCode) {
    return countryList.getName(countryCode)
}

function getCountryInfo(countryCode) {
    const country = getCountryByCode(countryCode)
    return wiki()
        .page(country)
        .then(page => page.summary())
        .then(info => {
            return {
                info: info.replace('( or (listen)) ', ''),
                country: country
            }
        })

}
module.exports = {
    getCountries: getCountries,
    setCountries: setCountries,
    getCountryByCode: getCountryByCode,
    getCountryInfo: getCountryInfo
}