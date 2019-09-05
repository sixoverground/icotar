const express = require('express')

const router = express.Router()

router.get('/initials', (req, res) => res.render('docs/initials', {
  title: 'Colorful Initials Avatars - Icotar',
}))

module.exports = router
