import React, { useState, useEffect } from 'react'
import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'

import { getCountries, getCalamity } from '../backend'

const handleSelectCountry = (e, countryCode) => {
  // TODO: list some of the news articles or maybe tags
  // TODO: list some petitions to help with or resources
}

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    console.log(`Sending request to /api/countries`)
    setLoading(true)
    getCountries().then(response => {
      return Promise.all(response.data.countries.map(country => {
        return getCalamity(country)
          .then(calamity => {
            const countryCode = Object.keys(country)[0]
            // TODO: maybe store min and max during cronjob (also, somehow these are incorrect)
            if (calamity[countryCode] > max) {
              setMax(calamity[countryCode])
            }
            if (calamity[countryCode] < min) {
              setMin(calamity[countryCode])
            }
            setCountries(countries => {
              return {
                ...countries,
                ...calamity
              }
            })
          })
      }))
      .then(() => {
        setLoading(false)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Loader isActive={loading}>
      <h1 id='title'>World map of calamities</h1>
      <CalamityMap countries={countries} min={min} max={max} handleSelectCountry={handleSelectCountry} />
    </Loader>
  )
}

export default CalamityMapContainer