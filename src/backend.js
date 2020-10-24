import axios from 'axios'

const api = axios.create()

export const getCountries = () => {
  return api({
      url: '/api/countries',
      method: 'get'
  })
}

export const getCalamities = () => {
  return api({
    url: '/api/calamity',
    method: 'get'
  })
  .then(response => {
    return Promise.resolve(response)
  })
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
  const countryCode = Object.keys(country)[0]
  return api({
    url: '/api/news/' + country[countryCode],
    method: 'get'
  })
  .catch(() => {
    return Promise.resolve({
      [countryCode]: 0 // TODO: what to do when one fails
    })
  })
}

export const getMaxCalamity = () => {
  return api({
    url: '/api/max/calamity',
    method: 'get'
  })
  .catch(() => {
    return Promise.resolve(0)
  })
}

export const getMinCalamity = () => {
  return api({
    url: '/api/min/calamity',
    method: 'get'
  })
  .catch(() => {
    return Promise.resolve(0)
  })
}