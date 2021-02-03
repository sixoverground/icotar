const express = require('express')
const avatarRouter = require('./avatar')
const docsRouter = require('./docs')
const initialsRouter = require('./initials')
const profileRouter = require('./profiles')
const randomstring = require('randomstring');
const {
  COLORS,
  DEFAULT_SIZE,
  generatePng,
  generateSvg,
} = require('../utils/avatar')
const { generateProfile } = require('../utils/profile')

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

const getRandomProfile = (req, res) => {
  const { hash } = randomstring.generate();
  const gender = "neutral";
  const json = generateProfile(hash, gender);
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(json, null, 4));
}

router.use('/avatar', avatarRouter)
router.use('/initials', initialsRouter)
router.use('/docs', docsRouter)
router.use('/profiles', profileRouter)
router.get('/profiles', (req, res) => getRandomProfile(req, res))

router.get('/', (req, res) => res.render('welcome', {
  title: 'Icotar - Colorful Icon Avatars',
}))

module.exports = router
