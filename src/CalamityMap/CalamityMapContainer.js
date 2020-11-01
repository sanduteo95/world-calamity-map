import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Popup from 'reactjs-popup'
import { PieChart } from 'react-minimal-pie-chart'

import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'

import { getNews, getCountryInfo, getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../backend'

const CalamityMapContainer = () => {
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(200)
  const [max, setMax] = useState(-200)
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [content, setContent] = useState('')
  const [news, setNews] = useState([])
  const [navbar, setNavbar] = useState('about')
  const [country, setCountry] = useState('')
  const [countryInfo, setCountryInfo] = useState('')

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
      <CalamityMap 
        countries={countries} 
        min={min} 
        max={max} 
        setTooltipContent={setContent}
        setPopupNews={(countryCode) => {
          if (selectedCountry !== countryCode) {
            setSelectedCountry(countryCode)
            return getNews(countryCode)
              .then(response => {
                setNews(response.data.news)
                setNavbar('about')
                return getCountryInfo(countryCode)
              })
              .then(response => {
                setCountry(response.data.country)
                setCountryInfo(response.data.info)
              })
          } else {
            setSelectedCountry('')
            setCountry('')
            setNews([])
            setNavbar('about')
            setCountryInfo('')
          }
      }} />
      <ReactTooltip>
        {content}
      </ReactTooltip>  
      <Popup open={news && news.length > 0} onClose={() => setNews([])} position='right center'>
        <ul className='Navbar'>
          <li class='about'><div onClick={() => setNavbar('about')}>About</div></li>
          <li class='articles'><div onClick={() => setNavbar('articles')}>Articles</div></li>
          <li class='petitions'><div onClick={() => setNavbar('petitions')}>Petitions</div></li>
          <li class='statistics'><div onClick={() => setNavbar('statistics')}>Statistics</div></li>
        </ul>

        {navbar === 'about' && (
          <div>
            <h3>{country}</h3>
            <div className='Content'>{countryInfo}</div>
          </div>
        )}
        {navbar === 'articles' && (
          <div className='Content'>
            <h3>News articles</h3>
            <ul className='List'>
              {news.map((newsArticle, index) => {
                return (<li key={newsArticle.title}>{index + 1}. <a target='__blank' href={newsArticle.link}>{newsArticle.title}</a><span className={newsArticle.score < 0 ? 'Bad' : 'Good'}>{newsArticle.score}</span></li>)
              })}
            </ul>
        </div>
        )}
        {navbar === 'petitions' && (
          <div>TODO</div>
        )}
        {navbar === 'statistics' && (
          <div>
            <h3>Overall spread of negative vs positive news</h3>
            <div className='Content'>
              <PieChart
                data={[
                  { title: 'Negative', value: news.filter(newsArticle => newsArticle.score < 0).length, color: 'red' },
                  { title: 'Positive', value: news.filter(newsArticle => newsArticle.score >= 0).length, color: 'green' }
                ]}
              />
            </div>
            <div>
              <div class='Bad Label'></div>Negative
              <div class='Good Label'></div>Positive
            </div>
          </div>
        )}
      </Popup>
    </Loader>
  )
}

export default CalamityMapContainer