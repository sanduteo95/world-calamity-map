const express = require('express')
const bodyParser = require('body-parser')
const pino = require('express-pino-logger')()
const countries = require('./countries')
const calamityCalculator = require('./calamity_calculator')

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
  // Promise.resolve(1000)
  calamityCalculator.getCalamityRatingPerCountry(req.params.country)
    .then(calamity => {
      console.log('Received response')
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ calamity: calamity }))
    })
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
)