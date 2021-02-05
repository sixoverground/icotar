const express = require('express');
const randomstring = require('randomstring');
const generateProfile = require('../utils/profile');
    
const router = express.Router();

const getProf = async (req, res) => {
    let { hash } = req.params;
    const gender = req.query?.g || req.query?.gender;
    if (!hash) {
        hash = randomstring.generate(10);
    }
    const json = generateProfile(hash, gender);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(json, null, 4));
}

router.get('/', (req, res) => getProf(req, res))

router.get('/:hash', (req, res) => getProf(req, res))

module.exports = router;