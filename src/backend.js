import axios from 'axios'

import { setupCache } from 'axios-cache-adapter'
 
// TODO: does this caching actually work or should I use node-cache instead?
// Create `axios-cache-adapter` instanceget
const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000 // 1 day
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter
})

export const getCountries = () => {
  return api({
      url: '/api/countries',
      method: 'get'
  })
}

export const getCalamities = (countries) => {
  // return getCalamitiesHelper(0, countries, {})
  return getCalamitiesHelper(countries)
}

// const getCalamitiesHelper = (i, countries, calamities) => {
//   if (i === undefined || i >= countries.length) {
//     return calamities
//   }

//   const country = countries[i]
//   const countryCode = Object.keys(country)[0]

//   console.log(i)
//   console.log(`Sending request to /api/calamity/${country[countryCode]}`)
//   return api({
//     url: '/api/calamity/' + country[countryCode],
//     method: 'get'
//   })
//     .then(response => {
//       calamities[countryCode] = response.data.calamity
//       return getCalamitiesHelper(i+1, countries, calamities)
//     })
// }

const getCalamitiesHelper = (countries) => {
  return Promise.all(countries.map(country => {
    const countryCode = Object.keys(country)[0]
    return api({
      url: '/api/calamity/' + countryCode,
      method: 'get'
    })
    .then(response => {
      return Promise.resolve({
        [countryCode]: response.data.calamity
      })
    })
    .catch(err => {
      return Promise.resolve({
        [countryCode]: 0 // TODO: what to do when one fails
      })
    })
  }))
  .then(responses => {
    const calamities = {}
    responses.forEach(response => {
      const countryCode = Object.keys(response)[0]
      calamities[countryCode] = response[countryCode]
    })
    return calamities
  })
}