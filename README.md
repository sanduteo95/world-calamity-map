# What's going on in the world today?

Website: [https://world-calamity-map.herokuapp.com/](https://world-calamity-map.herokuapp.com/)

This project centers around a map that colour codes all countries in the world according to how bad the news about them have been in the past 24 hours. It gets the latest news about a country and runs sentiment anlysis on them, computing a total score of "calamities" in that specific country. In this project the word "calamity" can refer to anything that can cause distress, although it still very subjective depending on the news article that get picked up. The countries are then colour coded from red (most affected by a distaster) to green (least affected), and upon clicking on them some general information from Wikipedia is displayed, alongside the news articles that were used, any petitions that could be found on [https://petition.parliament.uk](https://petition.parliament.uk), and a pie chart showing a very basic spread of the news.

This project came about after realising that a lot of things are going on around the world, but it's very hard to keep up-to-date with everything that is going on. This is meant to make it easier to get an overview of what is happening in the world and to find out if there are any ways to help.

## Screenshots

![Starting page][./images/main.ng]

![Starting page on closing informtional box][https://raw.githubusercontent.com/sanduteo95/world-calamity-map/master/images/main_2.ng]

![Pop-up dialog with more information][https://raw.githubusercontent.com/sanduteo95/world-calamity-map/master/images/popup.ng]

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs).
