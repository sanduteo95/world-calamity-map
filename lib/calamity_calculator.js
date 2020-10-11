const Sentiment = require('sentiment')
const newsCrawler = require('./news_crawler')
const NodeCache = require('node-cache')
const cache = new NodeCache()

const CACHE_TIMEOUT = 24 * 60 * 60 * 1000 // 1 day

// Gets the score of each article, in terms of how negative or positive it is
async function getCalamitiesPerCountry(country) {
    console.log(`Calculating gravity of calamities for country ${country}`)
    let totalScore = cache.get(country)
    if (totalScore !== undefined) {
        return totalScore
    }

    totalScore = 0
    try {
        const countryNews = await newsCrawler.getCountryNews(country)
        const sentiment = new Sentiment()
        Object.keys(countryNews).forEach(key => {
            const countryNewsArticle = countryNews[key]
            const result = sentiment.analyze(countryNewsArticle.content);
            const score = result.score
    
            console.dir(`${countryNewsArticle.title}: ${score}`)
            totalScore += score
        })
        cache.set(country, totalScore, CACHE_TIMEOUT)
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    return totalScore
}

// TODO: why does it have to be sequential for it to work
async function getCalamitiesHelper (i, countries, calamities) {
  if (i === undefined || i >= countries.length) {
    return calamities
  }

  const country = countries[i]
  const countryCode = Object.keys(country)[0]

  let calamity = 0
  try {
      calamity = await getCalamitiesPerCountry(country[countryCode])
  } catch (err) {
      console.error('Error: ' + err.message)
  }
  calamities[countryCode] = calamity

  return getCalamitiesHelper(i+1, countries, calamities)
}

function getCalamities (countries) {
    return getCalamitiesHelper(0, countries, {})
}

// function getCalamities (countries) {
//     return Promise.all(countries.map(async function (country) {
//         const countryCode = Object.keys(country)[0]
//         let calamity = 0
//         try {
//             calamity = await getCalamitiesPerCountry(country[countryCode])
//         } catch (err) {
//             console.error('Error: ' + err.message)
//         }
//         return {
//             [countryCode]: calamity
//         }
//     }))
//     .then(responses => {
//       const calamities = {}
//       responses.forEach(response => {
//         const countryCode = Object.keys(response)[0]
//         calamities[countryCode] = response[countryCode]
//       })
//       return calamities
//     })
// }

module.exports = {
    getCalamitiesPerCountry: getCalamitiesPerCountry,
    getCalamities: getCalamities
}