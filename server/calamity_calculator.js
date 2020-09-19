const Sentiment = require('sentiment')
const newsCrawler = require('./news_crawler')

// Gets the score of each article, in terms of how negative or positive it is
async function getCalamityRatingPerCountry(country) {
    console.log(`Calculating gravity of calamities for country ${country}`)
    const countryNews = await newsCrawler.getCountryNews(country)
    const sentiment = new Sentiment()
    let totalScore = 0
    Object.keys(countryNews).forEach(key => {
        const countryNewsArticle = countryNews[key]
        const result = sentiment.analyze(countryNewsArticle.content);
        // const negative = result.negative // negative words
        // const positive = result.positive // positive words
        const score = result.score

        console.dir(`${countryNewsArticle.title}: ${score}`)
        totalScore += score
    })
    return totalScore
}

// async function getCalamityRatingPerCountry(country) {
//     console.log(`Assigning a colour for calamity for ${country}`)
//     const colours = {
//         'dark red': '#8b0000',
//         'red': '#ff0000',
//         'amber': '#ffbf00',
//         'yellow': '#ffff00',
//         'light green': '#98fb98',
//         'green': '#32cd32'
//     }
//     const gravity = await getCalamityRatingPerCountry(country)
//     let colour
//     if (gravity < -1000) {
//         colour = 'dark red'
//     } else if (gravity < 0) {
//         colour = 'red'
//     } else if (gravity < 1000) {
//         colour = 'amber'
//     } else if (gravity < 2000) {
//         colour = 'yellow'
//     } else if (gravity < 3000) {
//         colour = 'light green'
//     } else {
//         colour = 'green'
//     }
//     return Promise.resolve(colours[colour])
// } 

module.exports = {
    getCalamityRatingPerCountry: getCalamityRatingPerCountry
}