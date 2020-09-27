import React, { useState, useEffect } from 'react'
import CalamityMap from './CalamityMap'
import { getCountries, getCalamity } from './backend'

const handleSelectCountry = (e, countryCode) => {
  // TODO: list some of the news articles or maybe tags
  // TODO: list some petitions to help with or resources
}

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)

  useEffect(() => {
    console.log(`Sending request to /api/countries`)
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
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // TODO: add spinner to show something is happening
    <div>
      <CalamityMap countries={countries} min={min} max={max} handleSelectCountry={handleSelectCountry} />
    </div>
  )
}

export default CalamityMapContainer