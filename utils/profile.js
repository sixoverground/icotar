const seedrandom = require('seedrandom');
const NAMES = require('../profile_data/names.json');
const IMGS = require('../profile_data/profile_imgs.json');
const {pickone} = require('./avatar');
const fs = require('fs');

// possible templates for profile bios, with placeholders specified between braces
const TEMPLATES = [
    '{job} at {company} based out of {location}.',
    '{job}, {company}. Based in {location}.',
    'A {location}-based {job}, currently employed at {company}.',
    'Experienced {job} from {location}, currently working for {company}.',
]

// possible jobs for bios, matched with the possible employers for each job
// some employers have placeholders specified between braces, similarly to bio templates
const JOBS = {
    'Accountant': [
        'TaxPro',
        'Simple Saving',
        'LMW Accounting',
        '{location} Health Center',
    ],
    'Software Developer': [
        '{lastname} Technology Solutions',
        'Roxeltech',
        'Televescence',
        'Softwear',
    ],
    'Project Manager': [
        'Simplicity',
        'Royal Consulting',
        'Edutute',
        'Iconify',
    ],
    'Attorney': [
        'Baker Brothers Attorneys',
        'Greenboro Consulting',
        '{lastname} and {lastname} Law Firm',
        'their epynomous law firm',
    ],
    'Nurse': [
        'North {location} Hospital',
        'First Call Medical Services',
        'the office of Rhonda Bakeweather, M.D',
        '{location} Public Schools',
    ],
    'Product Designer': [
        'Cooking Hub',
        'Southside Electronics',
        'Electric Entertainment',
        'Southside Eatery',
    ],
}

// available locations
const LOCATIONS = [
    'New York City',
    'Los Angeles',
    'San Francisco',
    'Houston',
    'London',
    'Paris',
    'Milan',
    'Dubai',
    'Rio de Janeiro',
    'Seoul',
    'Tokyo',
    'Chicago',
    'Shangai',
]

/**
 * generateProfile() creates a user profile with a name, image url, and bio
 * all bashed on a hashed string
 * 
 * @param {String} hash
 * @param {String} gender
 * @return {Object} bio
 */
const generateProfile = (hash, gender=null) => {
    const rng = seedrandom(hash);
    if (!gender || !['male', 'female'].includes(gender)) {
        gender = pickone(rng, ['male', 'female']);
    }
    const names = [];
    names.push(...NAMES.first[gender]);
    names.push(...NAMES.first.neutral);
    const fname = pickone(rng, names);
    let mi;
    if (pickone(rng, Array(10).fill(0).map((_, i) => i)) > 7) {
        mi = pickone(rng, 'abscdefghijklmnopqrstuvwxyz'.toUpperCase()) + '.';
    }
    const lname = pickone(rng, NAMES.last);
    const fullName = `${fname} ${mi ? mi + ' ' : ''}${lname}`;
    const template = pickone(rng, TEMPLATES);
    const url = pickone(rng, IMGS[gender]);
    const thumbnailUrl = url.replace(/dpr=.&h=.+&w=.+/, 'dpr=1&fit=crop&h=180&w=180');
    const job = pickone(rng, Object.keys(JOBS));
    const location = pickone(rng, LOCATIONS);
    const company = pickone(rng, JOBS[job]).replace(/{lastname}/g, lname).replace(/{location}/g, location).replace(/{fullname}/g, fullName);
    return {
        name: {
            full: fullName,
            first: fname,
            middle: (mi ? mi : undefined),
            last: lname,
        },
        image: {
            url,
            thumbnailUrl,
        },
        bio: template.replace(/{location}/g, location).replace(/{job}/g, job).replace(/{company}/g, company),
        id: hash,
    }
};

module.exports = {
    generateProfile
}