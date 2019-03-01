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

const COLORS = [
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

const ICONS = [
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
  'weekend',
]

const integer = (r, min, max) => Math.floor(r() * (max - min + 1) + min)

const pickone = (r, arr) => arr[integer(r, 0, arr.length - 1)]

const generateSvg = (hash, colors, icons) => {
  const rng = seedrandom(hash)
  const color = pickone(rng, colors)
  const icon = pickone(rng, icons)
  let whiteIcon
  if (icon) {
    const iconPath = `./icons/baseline-${icon}-24px.svg`
    const iconContent = fs.readFileSync(path.resolve(__dirname, iconPath), 'utf8')
    const x2js = new X2JS()
    const jsonObj = x2js.xml2js(iconContent)
    // eslint-disable-next-line no-underscore-dangle
    jsonObj.svg._fill = '#fff'
    // eslint-disable-next-line no-underscore-dangle
    jsonObj.svg._x = '4'
    // eslint-disable-next-line no-underscore-dangle
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
  const parsedSize = Number.isNaN(size) ? 80 : size
  const sizeInt = parseInt(parsedSize, 10)
  const minSize = Math.max(sizeInt, 1)
  return Math.min(minSize, 1024)
}

const router = express.Router()

router.get('/avatar/:hash.svg', (req, res) => {
  const { hash } = req.params
  const svg = generateSvg(hash, COLORS, ICONS)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar/:hash.png', async (req, res) => {
  const { hash } = req.params
  const size = req.query.s || req.query.size || 80
  const trimmedSize = trimSize(size)
  const svg = generateSvg(hash, COLORS, ICONS)
  const png = await sharp(Buffer.from(svg), {
    density: 72 * trimmedSize / 32,
  })
    .resize(trimmedSize, trimmedSize)
    .png()
    .toBuffer()
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/avatar/:hash', (req, res) => {
  const { hash } = req.params
  const svg = generateSvg(hash, COLORS, ICONS)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar.svg', (req, res) => {
  const hash = ''
  const svg = generateSvg(hash, COLORS, [])
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/avatar.png', async (req, res) => {
  const hash = ''
  const size = req.query.s || req.query.size || 80
  const trimmedSize = trimSize(size)
  const svg = generateSvg(hash, COLORS, [])
  const png = await sharp(Buffer.from(svg), {
    density: 72 * trimmedSize / 32,
  })
    .resize(trimmedSize, trimmedSize)
    .png()
    .toBuffer()
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/avatar', (req, res) => {
  const hash = ''
  const svg = generateSvg(hash, COLORS, [])
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
})

router.get('/', (req, res) => res.render('welcome', {
  title: 'Icotar - Colorful Icon Avatars',
}))

app.use('/', router)

const port = process.env.PORT || 5000
const env = app.get('env')
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App is listening on port ${port} in ${env} mode!`))
