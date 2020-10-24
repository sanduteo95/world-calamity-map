const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const pino = require('express-pino-logger')()
const countries = require('./lib/countries')
const newsCrawler = require('./lib/news_crawler')
const calamityCalculator = require('./lib/calamity_calculator')
const cron = require('./lib/cron')

const mocks = require('./mocks/index')

// start cron job
if (process.env.NODE_ENV === 'production') {
  cron.start()
}

const port = process.env.PORT || 3001

// create API
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(pino)

app.get('/api/countries', (req, res) => {
  console.log(`Receiving request at /api/countries`)
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(countries.getCountries()))
})

app.get('/api/max/calamity', (req, res) => {
  console.log(`Receiving request at /api/max/calamity`)
  if (process.env.NODE_ENV === 'production') {
    let max
    try {
      max = calamityCalculator.getMaxCalamity()
    } catch (err) {
      console.log(err)
      max = 400
    }
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({max: max}))
  } else {
    res.setHeader('Content-Type', 'application/json')
    const calamities = Object.values(mocks.calamities)
    let max = 0
    for(let i=0; i<calamities.length; i++) {
      if (calamities[i] > max) {
        max = calamities[i]
      }
    }

    res.send(JSON.stringify({max: max}))
  }
})

app.get('/api/min/calamity', (req, res) => {
  console.log(`Receiving request at /api/min/calamity`)
  if (process.env.NODE_ENV === 'production') {
    let min
    try {
      min = calamityCalculator.getMinCalamity()
    } catch (err) {
      console.log(err)
      min = -400
    }
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({min: min}))
  } else {
    res.setHeader('Content-Type', 'application/json')
    const calamities = Object.values(mocks.calamities)
    let min = 0
    for(let i=0; i<calamities.length; i++) {
      if (calamities[i] < min) {
        min = calamities[i]
      }
    }
    res.send(JSON.stringify({min: min}))
  }
})

app.get('/api/calamity', (req, res) => {
  console.log(`Receiving request at /api/calamity`)
  if (process.env.NODE_ENV === 'production') {
    calamityCalculator.getCalamities()
      .then(calamities => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(calamities))
      })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(mocks.calamities))
  }
})

app.get('/api/calamity/:country', (req, res) => {
  console.log(`Receiving request at /api/calamity/${req.params.country}`)
  if (process.env.NODE_ENV === 'production') {
    calamityCalculator.getCalamitiesPerCountry(req.params.country)
      .then(calamity => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({ calamity: calamity }))
      })
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ calamity: mocks.calamity(req.params.country) }))
    }
})

app.get('/api/news/:country', (req, res) => {
  console.log(`Receiving request at /api/nws/${req.params.country}`)
  if (process.env.NODE_ENV === 'production') {
    newsCrawler.getCountryNews(req.params.country)
      .then(news => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({ news: news }))
      })
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ news: {
        'http://www.test.com': {
          title: 'Test',
          content: 'Test'
        }
      }}))
    }
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () =>
  console.log('Express server is running on localhost:' + port)
)