'use strict'

const mongoose = require('mongoose');

const placeSchema = Schema({
    name: String,
    description: String,
    location: String,
    stockTicket: Number,
    priceTicket: Number
});

module.exports = mongoose.model('place', placeSchema);