
const request = require('request')
const util = require('util')

const makeRequestCallback = (path, callback) => {
    const requestOptions = {
        json: true
    }    
    request('https://petition.parliament.uk' + path, requestOptions, (err, res) => {
        if (err) {
            callback(err)
        }
        callback(undefined, res.body.data.map(petition => {
            return {
                link: petition.links.self.replace('.json', ''),
                title: petition.attributes.action,
                count: petition.attributes.signature_count
            }
        }))
    })
}
const makeRequest = util.promisify(makeRequestCallback)

// Information taken from : https://github.com/alphagov/e-petitions/issues/417
// /petitions.json
// /petitions/:id.json

// q - a search string that will filter the results by PostgreSQL full-text search
// state - one of a pre-defined set of petition lists which defaults to 'all'
// page - a number indicating which page of results should be returned (numbered from 1 and fixed at 50 per page)

// const getPetitions = () => {
//     makeRequest('/petitions.json?state=open')
//         .then(response => {
//             console.log(response)
//         })
// }

// const getPetition = (id) => {
//     makeRequest('/petitions/' + id + '.json')
//         .then(response => {
//             console.log(response)
//         })
// }

const getPetitionsByCountry = (country) => {
    return makeRequest('/petitions.json?q=' + country)
}

module.exports = {
    getPetitionsByCountry: getPetitionsByCountry
}