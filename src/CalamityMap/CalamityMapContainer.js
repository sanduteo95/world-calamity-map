import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'
import InfoBox from '../InfoBox/InfoBox'
import CountryPopup from '../CountryPopup/CountryPopup'
import ErrorPopup from '../ErrorPopup/ErrorPopup'

import { getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../backend'

const CalamityMapContainer = () => {
  const [loading, setLoading] = useState(false)
  const [openCountryPopup, setOpenCountryPopup] = useState(false)
  const [error, setError] = useState('')

  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(200)
  const [max, setMax] = useState(-200)
  
  const [countryCode, setCountryCode] = useState('')
  const [tooltipContent, setTooltipContent] = useState('')

  useEffect(() => {
    console.log(`Sending request to /api/countries`)
    let savedCountries
    setLoading(true)
    getCountries()
      .then(response => {
        savedCountries = response.data.countries
        if (!response.data.cached) {
          return Promise.all(savedCountries.map(country => {
            return getCalamity(country)
              .then(calamity => {
                const countryCode = Object.keys(country)[0]
                setMax(max => {
                  if (calamity[countryCode] > max) {
                    return calamity[countryCode]
                  } else {
                    return max
                  }
                })
                setMin(min => {
                  if (calamity[countryCode] < min) {
                    return calamity[countryCode]
                  } else {
                    return min
                  }
                })
                setCountries(countries => {
                  return {
                    ...countries,
                    ...calamity
                  }
                })
              })
          }))
          .catch(err => {
            setError(err.message)
          })
        } else {
          return getMaxCalamity()
            .then(response => {
              setMax(response.data.max)
              return getMinCalamity()
            })
            .then(response => {
              setMin(response.data.min)
              return getCalamities(savedCountries)
            })
            .catch(() => {
              return getCalamities(savedCountries)
            })
            .then(response => {
              const calamities = response.data
              let newMax = -200
              let newMin = 200
              if (max !== newMax && min !== newMin) {
                for(let i=0; i<calamities.length; i++) {
                  if (calamities[i] > newMax) {
                    newMax = calamities[i]
                  }
                  if (calamities[i] < newMin) {
                    newMin = calamities[i]
                  }
                }
                setMax(newMax)
                setMin(newMin)
              }
              setCountries(calamities)
              return
            })
        }
      })
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Loader isActive={loading} text={countries.length > 0 ? 'Loading country data...' : 'Loading countries...'}>
      <InfoBox />
      <CalamityMap 
        countries={countries} 
        min={min} 
        max={max} 
        setTooltipContent={setTooltipContent}
        setPopupNews={(countryCode) => {
          setCountryCode(countryCode)
          setOpenCountryPopup(true)
        }} />
      <ReactTooltip>
        {tooltipContent}
      </ReactTooltip>  
      {openCountryPopup && <CountryPopup 
        countryCode={countryCode} 
        handleClose={() => setOpenCountryPopup(false)}
        handleError={setError} />}
      {error !== '' && <ErrorPopup message={error} handleClose={() => setError('')} />}
    </Loader>
  )
}

export default CalamityMapContainer