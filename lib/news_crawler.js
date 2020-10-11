// const googleNewsScraper = require('google-news-scraper') // TODO: change this? this is causing max events listener

const GoogleNewsRss = require('google-news-rss')
const googleNews = new GoogleNewsRss()
 
const crawler = require('crawler')
const textVersion = require('textversionjs')

// Crawls an article at a specifc link
async function crawlNewsArticle(article) {
    console.log(`Crawling article at link ${article.link}`)
    return new Promise((resolve, reject) => {
        const websiteCrawler = new crawler({
            maxConnections: 10
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

// TODO: make it quicker, figure out which library to use (or implement own one)
// Gets all the countries related to a given country and within a time frame
async function getNewsArticles(country, timeFrame) {
    let articles = []
    try {
        // // Execute within an async function, pass a config object (further documentation below)
        // articles = await googleNewsScraper({
        //     searchTerm: country,
        //     prettyURLs: true,
        //     timeframe: timeFrame
        // })

        articles = await googleNews.search(country, 50, 'en', {
            as_eq: ['sport', 'football', 'athlete', 'music'], // retrieve results without the terms
            as_qdr: 'd', // retrieve results within the past day 
            gl: country,// boost results from that country
            scoring: 'r' // order by relevance
        }) // limit to 50 results
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    console.log(articles)
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
            // return crawlNewsArticle(article)
        }))
    } else {
        return Promise.resolve([])
    }
}

// Gets the news per provided country
async function getCountryNews(country) {
    let newsArticles = []
    // TODO: change time frame from UI (doesn't work with rss)
    try {
        newsArticles = await getNewsArticles(country, "1d")
    } catch (err) {
        console.error('Error: ' + err.message)
    }
    let news = {}
    newsArticles.forEach(newsArticle => {
        console.log('Found news article, adding it to news: ' + Object.keys(news))
        if (newsArticle !== undefined && newsArticle.error === '') {
            news[newsArticle.article.link] = {
                title: newsArticle.article.title,
                content: newsArticle.article.content
            }
        }
    })
    return Promise.resolve(news)
}

module.exports = {
    getCountryNews: getCountryNews
}