const express = require('express')
const bodyParser = require('body-parser')
const pino = require('express-pino-logger')()
const countries = require('./countries')
const calamityCalculator = require('./calamity_calculator')
const cron = require('./cron')

// start cron job
cron.start()

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
  calamityCalculator.getCalamitiesPerCountry(req.params.country)
    .then(calamity => {
      console.log('Received response')
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ calamity: calamity }))
    })
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
)