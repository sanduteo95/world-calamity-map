const countryList = require('country-list')
const NodeCache = require('node-cache')
const cache = new NodeCache()

const CACHE_TIMEOUT = 24 * 60 * 60 * 1000 // 1 day

// Get the countries in the format code : name
function getCountries() {
    let countries = cache.get('countries')
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
    cache.set('countries', countries, CACHE_TIMEOUT)
    return {
        cached: process.env.NODE_ENV === 'development' ? true : false,
        countries: countries
    }
}

module.exports = {
    getCountries: getCountries
}