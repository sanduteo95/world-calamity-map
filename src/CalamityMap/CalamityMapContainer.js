import React, { useState, useEffect } from 'react'
import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'

import { getNews, getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../backend'

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(-400)
  const [max, setMax] = useState(400)
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountryNews, setSelectedCountryNews] = useState({})

  useEffect(() => {
    console.log(`Sending request to /api/countries`)
    setLoading(true)
    getCountries()
      .then(response => {
        if (!response.data.cached) {
          return Promise.all(response.data.countries.map(country => {
            return getCalamity(country)
              .then(calamity => {
                const countryCode = Object.keys(country)[0]
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
            return getMaxCalamity()
          })
          .then(response => {
            setMax(response.data.max)
            return getMinCalamity()
          })
          .then(response => {
            setMin(response.data.min)
          })
        } else {
          return getMaxCalamity()
            .then(response => {
              setMax(response.data.max)
              return getMinCalamity()
            })
            .then(response => {
              setMin(response.data.min)
              return getCalamities(countries)
            })
            .then(response => {
              setCountries(response.data)
             })
            .catch(err => {
              console.log(err)
              return getCalamities(countries)
            })
            .then(response => {
              const calamities = response.data
              let max = 0
              let min = 0
              for(let i=0; i<calamities.length; i++) {
                if (calamities[i] > max) {
                  max = calamities[i]
                }
                if (calamities[i] < min) {
                  min = calamities[i]
                }
              }
              setCountries(calamities)
              setMax(max)
              setMin(min)
            })
        }
      })
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Loader isActive={loading}>
      <h1 id='title'>World map of calamities</h1>
      <CalamityMap countries={countries} min={min} max={max} selectedCountryCalamity={countries[selectedCountry]} selectedCountryNews={selectedCountryNews} handleSelectCountry={(e, countryCode) => {
        if (selectedCountry !== countryCode) {
          setSelectedCountry(countryCode)
          return getNews(countryCode)
            .then(response => {
              setSelectedCountryNews(response.data)
            })
          // TODO: list some of the news articles or maybe tags
          // TODO: list some petitions to help with or resources
        } else {
          setSelectedCountry('')
          setSelectedCountryNews({})
        }
      }} />
    </Loader>
  )
}

export default CalamityMapContainer