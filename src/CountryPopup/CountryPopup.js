import React, { useState, useEffect } from 'react'

import Popup from 'reactjs-popup'
import { PieChart } from 'react-minimal-pie-chart'
import ReactCountryFlag from 'react-country-flag'

import ScoredList from '../ScoredList/ScoredList'
import Navbar from '../Navbar/Navbar'
import Label from '../Label/Label'

import './CountryPopup.scss'

import { getNews, getPetitions, getCountryInfo, } from '../backend'

const CountryPopup = ({countryCode, handleClose, handleError}) => {
  const [navbar, setNavbar] = useState('about')

  const [country, setCountry] = useState('')
  const [countryInfo, setCountryInfo] = useState('')
  const [news, setNews] = useState([])
  const [petitions, setPetitions] = useState([])

  useEffect(() => {
    getCountryInfo(countryCode)
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
      .catch(err => {
        handleError(err.message)
      })
  })

  return (
    <Popup open onClose={handleClose} position='right center'>
      <Navbar 
        openTab={(tab) => setNavbar(tab)}
        tabTitle={country}
        tabIcon={<ReactCountryFlag className='Flag' countryCode={countryCode} />}
        tabSubtitle={navbar.toUpperCase()}
        renderTabContent={() => {
          switch (navbar) {
            case 'about':
              return <div className='InnerContent'>{countryInfo}</div>
            case 'articles':
              return (
                <div className='InnerContent'>
                  <ScoredList items={news} scoreKey='score' emptyListMessage={'Oops! It seems I was unable to find any news specifically from ' + country} />
                </div>)
            case 'petitions':
              return (
                <div className='InnerContent'>
                  <ScoredList items={petitions} scoreKey='count' emptyListMessage={'Oops! It seems I was unable to find any petitions specifically for ' + country} />
                </div>
              )
            case 'statistics':
              return (
                <div className='InnerContent'>
                  {news.length > 0 && (
                    <div className='PieChart'>
                      <PieChart
                        data={[
                          { title: 'Negative', value: news.filter(newsArticle => newsArticle.score < 0).length, color: 'red' },
                          { title: 'Positive', value: news.filter(newsArticle => newsArticle.score >= 0).length, color: 'green' }
                        ]}
                      />
                    </div>
                  )}
                  {news.length > 0 && (
                    <div>   
                      <Label isBad />
                      <Label />
                    </div>
                  )}
                  {news.length === 0 && (<p>Oops! It seems I was unable to find any news specifically from {country} </p>)}
                </div>
              )
            default:
              throw new Error('Tab not defined: ' + navbar)
          }
        }} />
    </Popup>
  )
}

export default CountryPopup