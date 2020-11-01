const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const pino = require('express-pino-logger')()
const countries = require('./lib/countries')
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
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(pino)

app.get('/api/countries', (req, res) => {
  console.log(`Receiving request at /api/countries`)
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(countries.getCountries()))
})

app.get('/api/countries/:country', (req, res) => {
  console.log(`Receiving request at /api/countries/${req.params.country}`)

  countries.getCountryInfo(req.params.country)
    .then(info => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(info))
    })
})

app.get('/api/max/calamity', (req, res) => {
  console.log(`Receiving request at /api/max/calamity`)
  if (process.env.NODE_ENV === 'production') {
    let max
    try {
      max = calamityCalculator.getMaxCalamity()
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
      return
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
      res.status(500).send(err)
      return
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

app.post('/api/calamity', (req, res) => {
  console.log(`Receiving request at /api/calamity`)
  console.log(req.body)
  if (process.env.NODE_ENV === 'production') {
    calamityCalculator.getCalamities(req.body)
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
    calamityCalculator.getCalamitiesPerCountryWithNews(req.params.country)
      .then(news => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({ news: news }))
      })
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ news: [
        {
          link: 'http://www.test1.com',
          title: 'Test 1',
          content: 'Test 1',
          score: -1
        },
        {
          link: 'http://www.test2.com',
          title: 'Test 2',
          content: 'Test 2',
          score: 1
        },
        {
          link: 'http://www.test3.com',
          title: 'Test 3',
          content: 'Test 3',
          score: 3
        }
      ]}))
    }
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')))
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

app.listen(port, () =>
  console.log('Express server is running on localhost:' + port)
)