import React, { useState, useEffect } from 'react'
import CalamityMap from './CalamityMap'
import { getCountries, getCalamities } from './backend'

const handleSelectCountry = (e, countryCode) => {
  // TODO: list some of the news articles or maybe tags
  // TODO: list some petitions to help with or resources
}

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log(`Sending request to /api/countries`)
    getCountries().then(response => {
      // TODO: get all countries, not just the first 4
        return getCalamities(response.data.countries.slice(0, 4))
      })
      .then(countries => {
        // TODO: don't set it just this one time, set it as we get each data
        setCountries(countries)
      })
  }, [])

  return (
    <div>
      <CalamityMap countries={countries} handleSelectCountry={handleSelectCountry} />
    </div>
  )
}

export default CalamityMapContainer