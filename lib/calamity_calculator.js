const Sentiment = require('sentiment')
const newsCrawler = require('./news_crawler')
const countries = require('./countries')

const NodeCache = require('node-cache')
const cache = new NodeCache()
const constants = require('./constants')

function getMaxCalamity() {
    const max = cache.get('max')
    if (max === undefined) {
        throw new Error('Maximum not set yet')
    }
    return max
}

function getMinCalamity() {
    const min = cache.get('min')
    if (min === undefined) {
        throw new Error('Minimum not set yet')
    }
    return min
}

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
        cache.set(country, totalScore, constants.CACHE_TIMEOUT)
        const max = cache.get('max')
        const min = cache.get('min')
        if (max === undefined || totalScore > max) {
            cache.set('max', totalScore, constants.CACHE_TIMEOUT)
        }
        if (min === undefined || totalScore < min) {
            cache.set('min', totalScore, constants.CACHE_TIMEOUT)
        }
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    return totalScore
}

// TODO: use cache so we don't have to compute the scores all over again
// Gets each article with score
async function getCalamitiesPerCountryWithNews(countryCode) {
    const country = countries.getCountryByCode(countryCode)
    let newsScore = []
    try {
        const countryNews = await newsCrawler.getCountryNews(country)
        const sentiment = new Sentiment()
        Object.keys(countryNews).forEach(key => {
            const countryNewsArticle = countryNews[key]
            const result = sentiment.analyze(countryNewsArticle.content);
            const score = result.score
            newsScore.push({
                title: countryNewsArticle.title,
                link: key,
                score: score
            })
        })
    } catch (err) {
        console.error('Error: ' + err.message)
    }

    // Return highest score first
    return newsScore.sort(function(news1, news2) {
        return news1.score - news2.score
    })
}

function getCalamities (countries) {
    return Promise.all(countries.map(async function (country) {
        const countryCode = Object.keys(country)[0]
        let calamity = 0
        try {
            calamity = await getCalamitiesPerCountry(country[countryCode])
        } catch (err) {
            console.error('Error: ' + err.message)
        }
        return {
            [countryCode]: calamity
        }
    }))
    .then(responses => {
      const calamities = {}
      responses.forEach(response => {
        const countryCode = Object.keys(response)[0]
        calamities[countryCode] = response[countryCode]
      })
      return calamities
    })
}

module.exports = {
    getCalamitiesPerCountry: getCalamitiesPerCountry,
    getCalamitiesPerCountryWithNews: getCalamitiesPerCountryWithNews,
    getCalamities: getCalamities,
    getMaxCalamity: getMaxCalamity,
    getMinCalamity: getMinCalamity
}