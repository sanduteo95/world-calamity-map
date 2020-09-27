import axios from 'axios'

const api = axios.create()

export const getCountries = () => {
  return api({
      url: '/api/countries',
      method: 'get'
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