import React, { useState, useEffect } from 'react'
import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'

import { getNews, getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../backend'

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(200)
  const [max, setMax] = useState(-200)
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')

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
            .catch(err => {
              console.log(err)
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
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Loader isActive={loading}>
      <h1 id='title'>World map of calamities</h1>
      <CalamityMap countries={countries} min={min} max={max} selectedCountryCalamity={countries[selectedCountry]} handleSelectCountry={(e, countryCode) => {
        if (selectedCountry !== countryCode) {
          setSelectedCountry(countryCode)
          return getNews(countryCode)
            .then(response => {
              Array.from(document.getElementsByClassName('jvectormap-tip')).forEach((el) => { 
                if (el.innerHTML.includes(countryCode)) {
                  el.className += ' jvectormap-tip-news'
                  el.innerHTML += '<br/>'
                  let child = '<ul>'
                  response.data.news.forEach(newsArticle => {
                    child += '<li><a href="' + newsArticle.link + '">' + newsArticle.title + '</a></li>'
                  })
                  child += '</ul>'
                  el.innerHTML += child
                } else {
                  el.remove()
                }
              })
            })
          // TODO: list some of the news articles or maybe tags
          // TODO: list some petitions to help with or resources
        } else {
          Array.from(document.getElementsByClassName('jvectormap-tip')).forEach((el) => { 
            el.remove()
          })
          setSelectedCountry('')
        }
      }} />
    </Loader>
  )
}

export default CalamityMapContainer