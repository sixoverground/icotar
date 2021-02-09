/* eslint-disable no-console */
const dotenv = require('dotenv')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '/.env') })
}

require('newrelic')
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const router = require('./routes')

const requireSSL = (req, res, next) => {
  if (
    !req.secure
    && req.get('x-forwarded-proto') !== 'https'
    && process.env.NODE_ENV === 'production'
  ) {
    return res.redirect(`https://${req.get('host')}${req.url}`)
  }
  return next()
}

const app = express()
app.set('view engine', 'pug')
app.use(morgan('dev'))
app.use(requireSSL)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Log who is accessing Icotar
app.use((req, res, next) => {
  const { url, ip, hostname } = req
  const reqPath = req.path
  const referrer = req.get('Referrer')
  const userAgent = req.get('User-Agent')
  console.log(`url=${url} path=${reqPath} ip=${ip} hostname=${hostname} referrer=${referrer} userAgent=${userAgent}`)
  next()
})

app.use('/', router)

const port = process.env.PORT || 5000
const env = app.get('env')
app.listen(port, () => console
  .log(`App is listening on port ${port} in ${env} mode!`))
