import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

import CalamityMap from './CalamityMap'
import Legend from './Legend/Legend'
import Loader from '../Loader/Loader'
import InfoBox from '../InfoBox/InfoBox'
import CountryPopup from '../CountryPopup/CountryPopup'
import ErrorPopup from '../ErrorPopup/ErrorPopup'

import { getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../../services/backend'

const CalamityMapContainer = () => {
  const [loading, setLoading] = useState(false)
  const [openCountryPopup, setOpenCountryPopup] = useState(false)
  const [error, setError] = useState('')

  const [map, setMap] = useState({
    min: 200,
    max: -200,
    countries: {}
  })

  const [countryCode, setCountryCode] = useState('')
  const [tooltipContent, setTooltipContent] = useState('')

  useEffect(() => {
    let savedCountries
    setLoading(true)
    getCountries()
      .then(response => {
        savedCountries = response.data.countries
        const cached = response.data.cached
        if (!cached) {
          return Promise.all(savedCountries.map(country => {
            return getCalamity(country)
              .then(calamity => {
                const countryCode = Object.keys(country)[0]
                setMap(map => {
                  return {
                    min: calamity[countryCode] < map.min ? calamity[countryCode] : map.min,
                    max: calamity[countryCode] > map.max ? calamity[countryCode] : map.max,
                    countries: {
                      ...map.countries,
                      ...calamity
                    }
                  }
                })
              })
          }))
        } else {
          let newMin = 200, newMax = -200
          return getMaxCalamity()
            .then(response => {
              newMax = response.data.max
              return getMinCalamity()
            })
            .then(response => {
              newMin = response.data.min
              return getCalamities(savedCountries)
            })
            .catch(() => {
              return getCalamities(savedCountries)
                .then(response => {
                  if (newMin !== map.min && newMax !== map.max) {
                    for(let i=0; i<response.data.length; i++) {
                      if (response.data[i] > newMax) {
                        newMax = response.data[i]
                      }
                      if (response.data[i] < newMin) {
                        newMin = response.data[i]
                      }
                    }
                  }
                  return response
                })
            })
            .then(response => {
              setMap({
                min: newMin,
                max: newMax,
                countries: response.data
              })
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
    <Loader isActive={loading} text={map.countries.length > 0 ? 'Loading country data...' : 'Loading countries...'}>
      <InfoBox />
      <CalamityMap 
        countries={map.countries} 
        min={map.min} 
        max={map.max} 
        setTooltipContent={setTooltipContent}
        setPopupNews={(countryCode) => {
          setCountryCode(countryCode)
          setOpenCountryPopup(true)
        }} />
      <Legend min={map.min} max={map.max}/>
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