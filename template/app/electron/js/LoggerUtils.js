/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Becauseqa.Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

const fs = require('fs')
const winston = require('winston')
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
        (options.meta && Object.keys(options.meta).length ? `\n\t` + options.meta.stack.join('\n').toString() : ` `)
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
