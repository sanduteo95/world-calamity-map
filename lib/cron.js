const CronJob = require('cron').CronJob
const getCountries = require('./countries').getCountries
const getCalamities = require('./calamity_calculator').getCalamities
const constants = require('./constants')

function start() {
    const task = async function() {
        const countries = await getCountries(true).countries
        await getCalamities(countries)
        console.log('Computed calamities!')
    }

    let date = new Date()
    date.setSeconds(date.getSeconds() + 2)
    const initJob = new CronJob(date, task)
    initJob.start()

    const midnightJob = new CronJob(constants.CRON_TIME, task)
    midnightJob.start()
}

module.exports = {
    start: start
}