const fs = require('fs')
const path = require('path')
const seedrandom = require('seedrandom')
const sharp = require('sharp')
const X2JS = require('x2js')

// default PNG size
const DEFAULT_SIZE = 80

// smallest PNG size
const MIN_SIZE = 1

// largest PNG size
const MAX_SIZE = 1024

// outer color size
const SVG_SIZE = 32

// inner icon size
const ICON_SIZE = 24

// available colors
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

/**
 * integer() generates a random integer between the minimum and maximum
 * based on the seeded random number generator
 *
 * @param {seedrandom} seededRng
 * @param {Integer} min
 * @param {Integer} max
 * @return {Integer} integer
 */
const integer = (seededRng, min, max) => Math
  .floor(seededRng() * (max - min + 1) + min)

/**
 * pickone() picks a random element from an array
 * using the seeded random number generator
 *
 * @param {seedrandom} seededRng
 * @param {Array} arr
 * @return {Object} object
 */
const pickone = (seededRng, arr) => arr[integer(seededRng, 0, arr.length - 1)]

/**
 * trimSize() constrains a size within a boundary
 *
 * @param {Integer} size
 * @param {Integer} defaultSize
 * @param {Integer} minSize
 * @param {Integer} maxSize
 * @return {Integer} integer
 */
const trimSize = (size, defaultSize, minSize, maxSize) => {
  const parsedSize = Number.isNaN(size) ? defaultSize : size
  const sizeInt = parseInt(parsedSize, 10)
  const trimmedSize = Math.max(sizeInt, minSize)
  return Math.min(trimmedSize, maxSize)
}

/**
 * generateSvg() creates an SVG with a white icon over a color background
 * based on a hash string
 *
 * @param {String} hash
 * @param {Array} colors
 * @param {Array} icons
 * @return {String} string
 */
const generateSvg = (hash, colors, icons) => {
  const rng = seedrandom(hash)
  const color = pickone(rng, colors)
  const icon = pickone(rng, icons)
  let whiteIcon
  if (icon) {
    const iconPath = `../icons/baseline-${icon}-${ICON_SIZE}px.svg`
    const iconFile = path.resolve(__dirname, iconPath)
    const iconContent = fs.readFileSync(iconFile, 'utf8')
    const x2js = new X2JS()
    const jsonObj = x2js.xml2js(iconContent)
    const offset = (SVG_SIZE - ICON_SIZE) / 2
    // eslint-disable-next-line no-underscore-dangle
    jsonObj.svg._fill = '#fff'
    // eslint-disable-next-line no-underscore-dangle
    jsonObj.svg._x = offset
    // eslint-disable-next-line no-underscore-dangle
    jsonObj.svg._y = offset
    whiteIcon = x2js.js2xml(jsonObj)
  } else {
    whiteIcon = ''
  }
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"',
    ` style="isolation:isolate" viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}">`,
    `<path d="M0 0h${SVG_SIZE}v${SVG_SIZE}H0V0z" fill="${color}" />`,
    whiteIcon,
    '</svg>',
  ].join('')
}

/**
 * generatePng() creates a PNG file from an SVG string at a specific size
 *
 * @param {*} svg
 * @param {*} size
 * @return {Promise} promise
 */
const generatePng = (svg, size) => {
  const trimmedSize = trimSize(size, DEFAULT_SIZE, MIN_SIZE, MAX_SIZE)
  const options = { density: 72 * trimmedSize / SVG_SIZE }
  return sharp(Buffer.from(svg), options)
    .resize(trimmedSize, trimmedSize)
    .png()
    .toBuffer()
}

module.exports = {
  COLORS,
  DEFAULT_SIZE,
  generatePng,
  generateSvg,
  pickone,
  SVG_SIZE,
}
