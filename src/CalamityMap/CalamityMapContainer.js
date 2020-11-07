import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Popup from 'reactjs-popup'
import { PieChart } from 'react-minimal-pie-chart'
import ReactCountryFlag from 'react-country-flag'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faSignature, faQuestion } from '@fortawesome/free-solid-svg-icons'

import CalamityMap from './CalamityMap'
import Loader from '../Loader/Loader'

import { getNews, getPetitions, getCountryInfo, getCountries, getCalamity, getCalamities, getMaxCalamity, getMinCalamity } from '../backend'

const CalamityMapContainer = () => {
  const [openInfoBox, setOpenInfoBox] = useState(true)
  const [countries, setCountries] = useState([])
  const [min, setMin] = useState(200)
  const [max, setMax] = useState(-200)

  const [loading, setLoading] = useState(false)
  
  const [selectedCountry, setSelectedCountry] = useState('')
  const [content, setContent] = useState('')
  const [news, setNews] = useState([])
  const [petitions, setPetitions] = useState([])

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
    <Loader isActive={loading} text={countries.length > 0 ? 'Loading country data...' : 'Loading countries...'}>
      <div className={'InfoBox' + (openInfoBox ? ' InfoBoxOpened' : ' InfoBoxClosed')}>
        <div className='InfoBoxRow'>
          <div className='InfoBoxColumn InfoBoxTitle'>
              <h2>What's it like in the world today?</h2>
              {openInfoBox && <p>
                Click on the map and scroll to zoom in and out. Move across the world by dragging your cursor around the map. Click on any country to see what the news are like for that day and what petitions you could help with.
              </p>}
          </div>
          {openInfoBox && <div className='InfoBoxColumn InfoBoxDetails'>
              <FontAwesomeIcon icon={faNewspaper} />
              <h3>News</h3>
              <p>Retrieves the top 50 news published about a country in the past day.</p>
          </div>}
          {openInfoBox && <div className='InfoBoxColumn InfoBoxDetails'>
              <FontAwesomeIcon icon={faSignature} />
              <h3>Petitions</h3>
              <p>Curates a list of country-specific petitions from https://petition.parliament.uk.</p>
          </div>}
          {openInfoBox && <div className='InfoBoxColumn InfoBoxDetails'>
              <FontAwesomeIcon icon={faQuestion} />
              <h3>Sentiment Analysis</h3>
              <p>Analyses news articles and computes a measure of how bad they are in the selected country.</p>
          </div>}
        </div>
        {openInfoBox && <div onClick={() => setOpenInfoBox(false)} className='InfoBoxClose'></div>}
        {!openInfoBox && <div onClick={() => setOpenInfoBox(true)} className='InfoBoxOpen'></div>}
      </div>
      <CalamityMap 
        countries={countries} 
        min={min} 
        max={max} 
        setTooltipContent={setContent}
        setPopupNews={(countryCode) => {
          if (selectedCountry !== countryCode) {
            setSelectedCountry(countryCode)
            setNavbar('about')
            return getCountryInfo(countryCode)
              .then(response => {
                setCountry(response.data.country)
                setCountryInfo(response.data.info)
                return getPetitions(response.data.country)
              })
              .then(response => {
                setPetitions(response.data.petitions)
                return getNews(countryCode)
              })
              .then(response => {
                setNews(response.data.news)
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
          <li className='about'><div onClick={() => setNavbar('about')}>About</div></li>
          <li className='articles'><div onClick={() => setNavbar('articles')}>Articles</div></li>
          <li className='petitions'><div onClick={() => setNavbar('petitions')}>Petitions</div></li>
          <li className='statistics'><div onClick={() => setNavbar('statistics')}>Statistics</div></li>
        </ul>

        {navbar === 'about' && (
          <div className='Content'>
            <div className='Title'>
              {country}
              <ReactCountryFlag className='Flag'  countryCode={selectedCountry} />
            </div>
            <h3 className='Subtitle'>About</h3>
            <div className='InnerContent'>{countryInfo}</div>
          </div>
        )}
        {navbar === 'articles' && (
          <div className='Content'>
            <div className='Title'>
              {country}
              <ReactCountryFlag className='Flag'  countryCode={selectedCountry} />
            </div>
            <h3 className='Subtitle'>News articles</h3>
            {news.length > 0 && (<ul className='List'>
              {news.map((newsArticle, index) => {
                return (<li key={newsArticle.title}>{index + 1}. <a target='__blank' href={newsArticle.link}>{newsArticle.title}</a><span className={newsArticle.score < 0 ? 'Bad' : 'Good'}>{newsArticle.score}</span></li>)
              })}
            </ul>)}
            {news.length === 0 && (<p>Oops! It seems I was unable to find any news specifically from {country} </p>)}
        </div>
        )}
        {navbar === 'petitions' && (
          <div className='Content'>
            <div className='Title'>
              {country}
              <ReactCountryFlag className='Flag'  countryCode={selectedCountry} />
            </div>
            <h3 className='Subtitle'>Petitions</h3>
            {petitions.length > 0 && (<ul className='List'>
              {petitions.map((petition, index) => {
                return (<li key={petition.title}>{index + 1}. <a target='__blank' href={petition.link}>{petition.title}</a><span>{petition.count}</span></li>)
              })}
            </ul>)}
            {petitions.length === 0 && (<p>Oops! It seems I was unable to find any petitions specifically for {country} </p>)}
          </div>
        )}
        {navbar === 'statistics' && (
          <div className='Content'>
            <div className='Title'>
              {country}
              <ReactCountryFlag className='Flag'  countryCode={selectedCountry} />
            </div>
            <h3 className='Subtitle'>Statistics</h3>
            {news.length > 0 && (<div className='PieChart'>
              <PieChart
                data={[
                  { title: 'Negative', value: news.filter(newsArticle => newsArticle.score < 0).length, color: 'red' },
                  { title: 'Positive', value: news.filter(newsArticle => newsArticle.score >= 0).length, color: 'green' }
                ]}
              />
            </div>)}
            {news.length > 0 && (<div>
              <div className='Bad Label'></div><span className='LabelName'>Negative</span>
              <div className='Good Label'></div><span className='LabelName'>Positive</span>
            </div>)}
            {news.length === 0 && (<p>Oops! It seems I was unable to find any news specifically from {country} </p>)}
          </div>
        )}
      </Popup>
    </Loader>
  )
}

export default CalamityMapContainer