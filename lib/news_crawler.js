
const GoogleNewsRss = require('google-news-rss')
const googleNews = new GoogleNewsRss()
 
const Sentiment = require('sentiment')

const NodeCache = require('node-cache')
const cache = new NodeCache()
const constants = require('./constants')

// TODO: make it quicker
// Gets all the countries related to a given country and within a time frame
async function getNewsArticles(country, timeFrame) {
    let articles = []
    try {
        // TODO: find a way to not print these to console.log
        articles = await googleNews.search(country, 50, 'en', {
            as_eq: ['sport', 'football', 'athlete', 'music'], // retrieve results without the terms
            as_qdr: timeFrame,
            gl: country,// boost results from that country
            scoring: 'r' // order by relevance
        }) // limit to 50 results
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    if (articles.length > 0) {
        return Promise.all(articles.map(article => {
            return {
                error: '',
                article: {
                    link: article.link,
                    title: article.title,
                    subtitle: article.subtitle,
                    content: article.description // TODO: figure out if description is enough or if need to crawl website
                }
            }
        }))
    } else {
        return Promise.resolve([])
    }
}

// Gets the news per provided country
async function getCountryNews(country) {
    let news = cache.get(country)
    if (news !== undefined) {
        return Promise.resolve(news)
    }
    let newsArticles = []
    // TODO: change time frame from UI (doesn't work with rss)
    try {
        newsArticles = await getNewsArticles(country, 'd') // retrieve results within the past day 
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    news = []
    newsArticles.forEach(newsArticle => {
        if (newsArticle !== undefined && newsArticle.error === '') {
            const sentiment = new Sentiment()
            const result = sentiment.analyze(newsArticle.article.content || newsArticle.article.title)

            news.push({
                title: newsArticle.article.title,
                content: newsArticle.article.content,
                score: result.score,
                link: newsArticle.article.link
            })
        }
    })
    cache.set(country, news, constants.CACHE_TIMEOUT)
    return Promise.resolve(news)
}

module.exports = {
    getCountryNews: getCountryNews
}