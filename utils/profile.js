const seedrandom = require('seedrandom');
const NAMES = require("../profile_data/names.json");
const IMGS = require("../profile_data/profile_imgs.json");
const {pickone} = require('./avatar');
const fs = require('fs');

const generateProfile = (hash, gender=null) => {
    const rng = seedrandom(hash);
    if (!gender || !['male', 'female'].includes(gender)) {
        gender = pickone(rng, ['male', 'female']);
    }
    const names = [];
    names.push(...NAMES.first[gender]);
    names.push(...NAMES.first.neutral);
    const fname = pickone(rng, names);
    const lname = pickone(rng, NAMES.last);
    const url = pickone(rng, IMGS[gender]);
    return {
        name: `${fname} ${lname}`,
        url,
        bio: '',
        id: hash,
    }
};

module.exports = generateProfile