import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

import CalamityMap from './CalamityMap'
import Legend from './Legend/Legend'
import Loader from '../Loader/Loader'
import InfoBox from '../InfoBox/InfoBox'
import CountryPopup from '../CountryPopup/CountryPopup'
import ErrorPopup from '../ErrorPopup/ErrorPopup'

import { getCountries, getCalamities, getMaxCalamity, getMinCalamity } from '../../services/backend'

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
    setLoading(true)
    getCountries()
      .then(response => {
        const savedCountries = response.data.countries

        let calamities
        let newMin
        let newMax
        return getCalamities(savedCountries)
          .then(response => {
            calamities = response.data
            return getMaxCalamity()
          }).then(response => {
            newMax = response.data.max
            return getMinCalamity()
          })
          .then(response => {
            newMin = response.data.min
            setMap({
              min: newMin,
              max: newMax,
              countries: calamities
            })
            return
          })
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