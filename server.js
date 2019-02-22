const dotenv = require('dotenv')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '/.env') })
}
require('newrelic') 
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const seedrandom = require('seedrandom')
const favicon = require('serve-favicon')
const sharp = require('sharp')
const X2JS = require('x2js')

const app = express()
app.set('view engine', 'pug')
app.use(morgan('dev'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

require.extensions['.svg'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8');
}

const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
]

const icons = [
  'ac_unit',
  'adjust',
  'airplanemode_active',
  'attach_file',
  'audiotrack',
  'beach_access',
  'brightness_3',
  'brightness_5',
  'brush',
  'bubble_chart',
  'bug_report',
  'business_center',
  'business',
  'category',
  'child_friendly',
  'directions_bike',
  'directions_boat',
  'directions_bus',
  'directions_car',
  'fastfood',
  'favorite',
  'filter_hdr',
  'filter_vintage',
  'fitness_center',
  'flag',
  'flash_on',
  'highlight',
  'local_dining',
  'local_florist',
  'local_movies',
  'local_pizza',
  'local_shipping',
  'local_taxi',
  'looks',
  'motorcycle',
  'pets',
  'star',
  'toys',
  'traffic',
  'vpn_key',
  'waves',
  'weekend'
]

const integer = (r, min, max) => {
  return Math.floor(r() * (max - min + 1) + min)
}

const pickone = (r, arr) => {
  return arr[integer(r, 0, arr.length - 1)]
}

const generateSvg = (hash, colors, icons) => {
  const rng = seedrandom(hash)
  const color = pickone(rng, colors)
  const icon = pickone(rng, icons)
  let whiteIcon
  if (icon) {
    const iconContent = require('./icons/baseline-' + icon + '-24px.svg')
    const x2js = new X2JS()
    const jsonObj = x2js.xml2js(iconContent)
    jsonObj.svg._fill = '#fff'
    jsonObj.svg._x = '4'
    jsonObj.svg._y = '4'
    whiteIcon = x2js.js2xml(jsonObj)
  } else {
    whiteIcon = ''
  }
  

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 32 32" version="1.1">',
    `<path d="M0 0h32v32H0V0z" fill="${color}" />`,
    whiteIcon,
    '</svg>',
  ].join('')
}

const trimSize = (size) => {
  const parsedSize = isNaN(size) ? 80 : size
  const sizeInt = parseInt(parsedSize)
  const minSize = Math.max(sizeInt, 1)
  return Math.min(minSize, 1024)
}

const router = express.Router()

router.get('/avatar/:hash.svg', (req, res, next) => {
  const hash = req.params.hash
  const svg = generateSvg(hash, colors, icons)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar/:hash.png', async (req, res, next) => {
  const hash = req.params.hash
  const size = req.query.s || req.query.size || 80
  const trimmedSize = trimSize(size)
  const svg = generateSvg(hash, colors, icons)
  const png = await sharp(Buffer.from(svg), {
      density: 72 * trimmedSize / 32
    })
    .resize(trimmedSize, trimmedSize)
    .png()
    .toBuffer()
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/avatar/:hash', (req, res, next) => {
  const hash = req.params.hash
  const svg = generateSvg(hash, colors, icons)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar.svg', (req, res, next) => {
  const hash = ''
  const svg = generateSvg(hash, colors, [])
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar.png', async (req, res, next) => {
  const hash = ''
  const size = req.query.s || req.query.size || 80
  const trimmedSize = trimSize(size)
  const svg = generateSvg(hash, colors, [])
  const png = await sharp(Buffer.from(svg), {
      density: 72 * trimmedSize / 32
    })
    .resize(trimmedSize, trimmedSize)
    .png()
    .toBuffer()
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/avatar', (req, res, next) => {
  const hash = ''
  const svg = generateSvg(hash, colors, [])
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/', (req, res, next) => {
  return res.render('welcome', {
    title: 'Icotar - Colorful Icon Avatars'
  })
})

app.use('/', router)

const port = process.env.PORT || 5000
const env = app.get('env')
app.listen(port, () => console.log(`App is listening on port ${port} in ${env} mode!`))
