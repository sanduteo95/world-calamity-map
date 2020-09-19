const googleNewsScraper = require('google-news-scraper')
const crawler = require('crawler')
const fs = require('fs')
const textVersion = require('textversionjs')

// Crawls an article at a specifc link
async function crawlNewsArticle(article) {
    // console.log(`Crawling article at link ${article.link}`)

    return new Promise((resolve, reject) => {
        const websiteCrawler = new crawler({
            rateLimit: 1000 // `maxConnections` will be forced to 1
        })
        websiteCrawler.direct({
            uri: article.link,
            skipEventRequest: false, // default to true, direct requests won't trigger Event:'request'
            callback: function(err, res) {
                if(err) {
                    // console.log(err)
                    return resolve({
                        error: err.message,
                        article: ''
                    })
                } else {
                    const plainText = textVersion(res.body.replace('<!DOCTYPE html>', ''))
                    // console.log(plainText)
                    return resolve({
                        error: '',
                        article: {
                            link: article.link,
                            title: article.title,
                            subtitle: article.subtitle,
                            content: plainText
                        }
                    })   
                }
            }
        })
    })
}

// Gets all the countries related to a given country and within a time frame
async function getNewsArticles(country, timeFrame) {
    // Execute within an async function, pass a config object (further documentation below)
    const articles = await googleNewsScraper({
        searchTerm: country,
        prettyURLs: true,
        timeframe: timeFrame
    })

    // TODO: limit number of articles?
    // console.log(articles)

    if (articles.length > 0) {
        return Promise.all(articles.map(article => {
            return crawlNewsArticle(article)
        }))
    } else {
        return Promise.resolve([])
    }

}

// Gets the news per provided country
async function getCountryNews(country) {
    let news = {}
    // TODO: change time frame from UI
    const responses = await getNewsArticles(country, "1d")
    // console.log(responses)
    responses.forEach(response => {
        console.log('Found response, adding it to news: ' + Object.keys(news))
        // console.log(response.article.title)
        // console.log(response.error)
        if (response !== undefined && response.error === '') {
            // console.log(response)
            news[response.article.link] = {
                title: response.article.title,
                content: response.article.content
            }
        }
    })
    return Promise.resolve(news)
}

module.exports = {
    getCountryNews: getCountryNews
}