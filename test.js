const mongoose = require('mongoose');
const _ = require('lodash');

console.log('Mongoose version:', mongoose.version);
console.log('Lodash union exists:', typeof _.union === 'function');