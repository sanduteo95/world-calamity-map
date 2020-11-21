import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
 
const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000 // 24 h
})
 
const api = axios.create({
  adapter: cache.adapter
})

const handleError = error => {
  let err
  if (error.response) {
    err = new Error(error.response.data)
    err.statusCode = error.response.status
  } else if (error.request) {
    err = new Error('Did not receive a response for request' + JSON.stringify(error.request))
    err.statusCode = 500
  } else {
    err = new Error(error.message)
    err.statusCode = 500
  }
  throw err
}

export const getCountries = () => {
  return api({
    url: '/api/countries',
    method: 'get'
  })
  .catch(handleError)
}

export const getCountryInfo = (countryCode) => {
  return api({
      url: '/api/countries/' + countryCode,
      method: 'get'
  })
  .catch(() => {
    return Promise.resolve({
      info: 'There were problems retrieving information about current country.',
      country: 'Error'
    })
  })
}

export const getCalamities = (countries) => {
  return api({
    url: '/api/calamity',
    method: 'post',
    contentType: 'application/json',
    data: countries
  })
  .then(response => {
    return Promise.resolve(response)
  })
  .catch(handleError)
}

export const getCalamity = (country) => {
  const countryCode = Object.keys(country)[0]
  return api({
    url: '/api/calamity/' + country[countryCode],
    method: 'get'
  })
  .then(response => {
    return Promise.resolve({
      [countryCode]: response.data.calamity
    })
  })
  .catch(() => {
    return Promise.resolve({
      [countryCode]: 0 // TODO: what to do when one fails
    })
  })
}

export const getNews = (country) => {
  return api({
    url: '/api/news/' + country,
    method: 'get'
  })
  .catch(handleError)
}

export const getPetitions = (country) => {
  return api({
    url: '/api/petitions/' + country,
    method: 'get'
  })
  .catch(handleError)
}


export const getMaxCalamity = () => {
  return api({
    url: '/api/max/calamity',
    method: 'get'
  })
  .then(response => {
    return Promise.resolve(response)
  })
  .catch(handleError)
}

export const getMinCalamity = () => {
  return api({
    url: '/api/min/calamity',
    method: 'get'
  })
  .then(response => {
    return Promise.resolve(response)
  })
  .catch(handleError)
}