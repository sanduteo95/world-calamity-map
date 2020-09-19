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
    // setCountries({
    //   AD: 1015, 
    //   AE: 3941,
    //   AF: 1181, 
    //   AG: 704
    // }) // TODO: comment out, used for testing
    getCountries().then(response => {
      // TODO: get all countries, not just the first 10
      return getCalamities(response.data.countries.slice(0, 10))
    })
    .then(countries => {
      console.log(countries)
      // TODO: don't set it just this one time, set it as we get the data for each country
      setCountries(countries)
    })
  }, [])

  return (
    // TODO: add spinner to show something is happening
    <div>
      <CalamityMap countries={countries} handleSelectCountry={handleSelectCountry} />
    </div>
  )
}

export default CalamityMapContainer