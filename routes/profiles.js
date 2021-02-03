const express = require('express');
const {
    NAMES,
    generateProfile
} = require('../utils/profile');
    
const router = express.Router();

const getProf = (req, res) => {
    const { hash } = req.params;
    const gender = req.query?.g || res.query?.gender || "neutral";
    const json = generateProfile(hash, gender);
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(json, null, 4));
}

router.get('/:hash', (req, res) => getProf(req, res));

module.exports = router;