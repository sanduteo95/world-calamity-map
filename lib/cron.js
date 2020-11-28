const CronJob = require('cron').CronJob
const getCountries = require('./countries').getCountries
const setCountries = require('./countries').setCountries
const getCalamities = require('./calamity_calculator').getCalamities
const constants = require('./constants')

function start() {
    let date = new Date()
    date.setSeconds(date.getSeconds() + 2)
    const initJob = new CronJob(date, async function() {
        const countries = await getCountries(false).countries
        await getCalamities(countries)
        console.log('Computed calamities for the first time!')
        setCountries(countries) // setting countries here so that we can use caching
    })
    initJob.start()

    const midnightJob = new CronJob(constants.CRON_TIME, async function() {
        const countries = await getCountries(true).countries
        await getCalamities(countries)
    })
    midnightJob.start()
}

module.exports = {
    start: start
}