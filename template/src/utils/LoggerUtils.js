// More info here: https://github.com/flatiron/winston
//如果前端的web运用了node的内部库，例如fs,path需要在webpack里面配置下
// node: {
//     fs: "empty"
// }
// Simple Example
import fs from 'fs'
import winston from 'winston'
winston.transports.DailyRotateFile = require('winston-daily-rotate-file')
const isDev = process.env.NODE_ENV === 'development'
const logDir = 'logs'
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}
const logFormatter = function (options) {
    // Return string will be passed to logger.
    return options.timestamp() + ` ` + options.level.toUpperCase() + `: ` + (options.message ? options.message : ` `) +
        (options.meta && Object.keys(options.meta).length ? `\n\t` + JSON.stringify(options.meta) : ` `)
}
const timestamp = function () {
    const nowTime = new Date()
    const dateString =
        nowTime.getUTCFullYear() + '/' +
        ('0' + (nowTime.getUTCMonth() + 1)).slice(-2) + '/' +
        ('0' + nowTime.getUTCDate()).slice(-2) + ' ' +
        ('0' + nowTime.getUTCHours()).slice(-2) + ':' +
        ('0' + nowTime.getUTCMinutes()).slice(-2) + ':' +
        ('0' + nowTime.getUTCSeconds()).slice(-2)
    return dateString
}
const consoleLog = new winston.transports.Console(
    {
        json: false,
        silent: false,
        prettyPrint: true,
        colorize: true,
        timestamp: timestamp,
        formatter: logFormatter
    }
)
const fileLog = new winston.transports.DailyRotateFile(
    {
        filename: `${logDir}/.log`,
        json: false,
        level: isDev ? 'debug' : 'info',
        prepend: true,
        datePattern: 'yyyy-MM-dd',
        localTime: true,
        timestamp: timestamp,
        formatter: logFormatter
    }
)
// Complex Example
const log = new winston.Logger({
    transports: [consoleLog, fileLog],
    exceptionHandlers: [consoleLog, fileLog],
    exitOnError: false,
    colors: [{
        info: 'blue',
        warn: 'yellow',
        error: 'red'
    }]
})
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
// logger.level = 'debug'

// export the logger
export default log
