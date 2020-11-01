const countryList = require('country-list')

const NodeCache = require('node-cache')
const cache = new NodeCache()
const constants = require('./constants')

// Get the countries in the format code : name
function getCountries(isCronJob) {
    let countries = isCronJob ? undefined : cache.get('countries')
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
    if (!isCronJob) {
        cache.set('countries', countries, constants.CACHE_TIMEOUT)
    }
    return {
        cached: process.env.NODE_ENV === 'development' ? true : false,
        countries: countries
    }
}

// Gets the country name by countryCode
function getCountryByCode(countryCode) {
    return countryList.getName(countryCode)
}

module.exports = {
    getCountries: getCountries,
    getCountryByCode: getCountryByCode
}