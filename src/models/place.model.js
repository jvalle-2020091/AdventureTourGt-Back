'use strict'

const mongoose = require('mongoose');

const placeSchema = Schema({
    name: String,
    description: String,
    image: String,
    location: String,
    duration: String,
    stockTicket: Number,
    priceTicket: Number,
    services: [{type: mongoose.Schema.ObjectId, ref: 'service'}]
});

module.exports = mongoose.model('place', placeSchema);