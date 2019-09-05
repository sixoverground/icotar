const express = require('express')
const avatarRouter = require('./avatar')
const docsRouter = require('./docs')
const initialsRouter = require('./initials')
const {
  COLORS,
  DEFAULT_SIZE,
  generatePng,
  generateSvg,
} = require('../utils/avatar')

const router = express.Router()

const getDefaultSvgHash = (req, res) => {
  const hash = ''
  const svg = generateSvg(hash, COLORS, [])
  res.status(200)
  res.setHeader('Content-Type', 'image/svg+xml')
  return res.end(svg)
}

router.get('/avatar.svg', (req, res) => getDefaultSvgHash(req, res))

router.get('/avatar.png', async (req, res) => {
  const hash = ''
  const size = req.query.s || req.query.size || DEFAULT_SIZE
  const svg = generateSvg(hash, COLORS, [])
  const png = await generatePng(svg, size)
  res.status(200)
  res.setHeader('Content-Type', 'image/png')
  return res.end(png)
})

router.get('/avatar', (req, res) => getDefaultSvgHash(req, res))

router.use('/avatar', avatarRouter)
router.use('/initials', initialsRouter)
router.use('/docs', docsRouter)

router.get('/', (req, res) => res.render('welcome', {
  title: 'Icotar - Colorful Icon Avatars',
}))

module.exports = router
