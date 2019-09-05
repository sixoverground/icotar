const express = require('express')
const {
  COLORS,
  DEFAULT_SIZE,
  generatePng,
  generateSvg,
} = require('../utils/avatar')

const router = express.Router()

// available icon names
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

const getSvgHash = (req, res) => {
  const { hash } = req.params
  const svg = generateSvg(hash, COLORS, ICONS)
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
}

router.get('/:hash.svg', (req, res) => getSvgHash(req, res))

router.get('/:hash.png', async (req, res) => {
  const { hash } = req.params
  const size = req.query.s || req.query.size || DEFAULT_SIZE
  const svg = generateSvg(hash, COLORS, ICONS)
  const png = await generatePng(svg, size)
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/:hash', (req, res) => getSvgHash(req, res))

module.exports = router
