const express = require('express')
const seedrandom = require('seedrandom')
const {
  COLORS,
  DEFAULT_SIZE,
  generatePng,
  pickone,
  SVG_SIZE,
} = require('../utils/avatar')

const router = express.Router()

const generateSvg = (name, colors, backgroundColor, foregroundColor, offset) => {
  const rng = seedrandom(name)
  const hexColor = backgroundColor ? `#${backgroundColor}` : backgroundColor
  const color = hexColor || pickone(rng, colors)
  const textColor = foregroundColor || 'fff'

  const escapedName = unescape(name)
  const parts = escapedName.split(' ') || []
  const firstName = parts.shift() || ''
  const lastName = parts.pop() || ''
  const firstInitial = firstName.length > 0 ? firstName[0] : ''
  const lastInitial = lastName.length > 0 ? lastName[0] : ''
  const initials = `${firstInitial}${lastInitial}`.toUpperCase()

  const letters = `<text font-family="Helvetica" font-size="14px" x="50%" y="50%" dy="${offset}em" fill="#${textColor}" alignment-baseline="central" text-anchor="middle">${initials}</text>`

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"',
    ` style="isolation:isolate" viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}">`,
    `<path d="M0 0h${SVG_SIZE}v${SVG_SIZE}H0V0z" fill="${color}" />`,
    letters,
    '</svg>',
  ].join('')
}

const getSvgName = (req, res) => {
  const { name } = req.params
  const { bg, fg } = req.query
  const svg = generateSvg(name, COLORS, bg, fg, 0)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
}

router.get('/:name.svg', (req, res) => getSvgName(req, res))

router.get('/:name.png', async (req, res) => {
  const { name } = req.params
  const { bg, fg } = req.query
  const size = req.query.s || req.query.size || DEFAULT_SIZE
  const svg = generateSvg(name, COLORS, bg, fg, 0.35)
  const png = await generatePng(svg, size)
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/:name', (req, res) => getSvgName(req, res))

module.exports = router
