const seedrandom = require('seedrandom');
const IMGS = require('../profile_data/profile_imgs.json');
const {pickone} = require('./avatar');
const fs = require('fs');
const path = require('path');
const LNAMES = require('../profile_data/lastnames.json');

// a path to the directory containing names JSONs
const NAMES_DIR = path.join(__dirname, '../profile_data/names');

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
        'Accuquik',
        '{lastname} Financial Solutions',
        'E-counting',
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
        'Tulip Developers',
        'Constatech',
        'Inspired Solutions',
    ],
    'Project Manager': [
        'Simplicity',
        'Royal Consulting',
        'Edutute',
        'Iconify',
        'Nature\'s Key Cafe',
        'Constatech',
        'Relorian Development',
    ],
    'Attorney': [
        'Baker Brothers Attorneys',
        'Greenboro Consulting',
        '{lastname} and {lastname} Law Firm',
        'their epynomous law firm',
        'Johnston and {lastname}, Attorneys at Law',
        'Harton Defense Attorneys',
        'Kroll Legal Group',
    ],
    'Nurse': [
        'North {location} Hospital',
        'First Call Medical Services',
        'the office of Rhonda Bakeweather, M.D',
        '{location} Public Schools',
        'Volunteer Emergency Medical Services',
        'Rollings Medical Center',
        'HRT Emergency Clinic',
    ],
    'Product Designer': [
        'Cooking Hub',
        'Southside Electronics',
        'Electric Entertainment',
        'Southside Eatery',
        'Iconify',
        'AutoDash',
        'Column One',
    ],
}

// available locations
const LOCATIONS = [
    'Amsterdam',
    'Bali',
    'Barcelona',
    'Beijing',
    'Berlin',
    'Buenos Aires',
    'Cairo',
    'Chicago',
    'Cincinnati',
    'Dubai',
    'Dublin',
    'Houston',
    'Lisbon',
    'London',
    'Los Angeles',
    'Mexico City',
    'Milan',
    'Mumbai',
    'New York City',
    'Paris',
    'Rio de Janeiro',
    'Rome',
    'San Francisco',
    'Seoul',
    'Shanghai',
    'Tokyo',
]

/**
 * generateProfile() creates a user profile with a name, image url, and bio
 * all bashed on a hashed string
 * 
 * @param {String} hash
 * @param {String} gender
 * @param {String} language
 * @return {Object} bio
 */
const generateProfile = (hash, gender, language) => {
    const rng = seedrandom(hash);
    if (!gender || !['male', 'female'].includes(gender)) {
        gender = pickone(rng, ['male', 'female']);
    }
    if (!language || !fs.existsSync(path.join(NAMES_DIR, gender + '-human-names-' + language + '.json'))) {
        language = 'en';
    }
    console.log(language);
    const names = JSON.parse(fs.readFileSync(path.join(NAMES_DIR, gender + '-human-names-' + language + '.json')));
    const fname = pickone(rng, names);
    let mi;
    if (pickone(rng, Array(10).fill(0).map((_, i) => i)) > 7) {
        mi = pickone(rng, 'abscdefghijklmnopqrstuvwxyz'.toUpperCase());
    }
    const lname = pickone(rng, LNAMES[language]);
    const fullName = `${fname} ${mi ? mi + '. ' : ''}${lname}`;
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