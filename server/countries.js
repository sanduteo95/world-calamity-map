const countryList = require('country-list')

// Get the countries in the format code : name
function getCountries() {
    const nameList = countryList.getNameList()
    const countries = Object.keys(nameList).map(key => {
        const code = nameList[key]
        const name = countryList.getName(code)
        return {
            [code]: name
        }
    })
    return countries
}

module.exports = {
    getCountries: getCountries
}