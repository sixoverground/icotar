const seedrandom = require('seedrandom');
const NAMES = require("./names.json");
const {pickone} = require('./avatar');

const generateProfile = (hash, gender=null) => {
    let names = Object.keys(NAMES.first).map(key => NAMES.first[key]).flat();
    if (gender && NAMES.first.hasOwnProperty(gender)) {
        names = NAMES.first[gender];
        if (gender !== 'neutral') names.push(...NAMES.first.neutral);
    }
    const rng = seedrandom(hash);
    const fname = pickone(rng, names);
    const lname = pickone(rng, NAMES.last);
    return {
        name: `${fname} ${lname}`,
        url: '',
        bio: ''
    }
};

module.exports = {
    NAMES,
    generateProfile
}