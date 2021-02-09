const express = require('express');
const randomstring = require('randomstring');
const {generateProfile} = require('../utils/profile');
const path = require('path');
const router = express.Router();

const getProf = async (req, res) => {
    let { hash } = req.params;
    const gender = req.query?.g || req.query?.gender;
    if (!hash) {
        hash = randomstring.generate(6);
    }
    const json = generateProfile(hash, gender);
    res.status(200);
    return res.json(json, null, 4);
}

router.get('/', (req, res) => getProf(req, res));

router.get('/:hash', (req, res) => getProf(req, res));

module.exports = router;