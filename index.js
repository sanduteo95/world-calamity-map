const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const pino = require('express-pino-logger')()
const countries = require('./lib/countries')
const calamityCalculator = require('./lib/calamity_calculator')
const cron = require('./lib/cron')

const mockCalamities = require('./mocks/index')

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
  res.send(JSON.stringify({ countries: countries.getCountries() }))
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
      res.send(JSON.stringify({ calamity: mockCalamities(req.params.country) }))
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