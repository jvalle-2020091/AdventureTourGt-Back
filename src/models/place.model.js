'use strict'

const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    location: String,
});

module.exports = mongoose.model('place', placeSchema);