'use strict'

const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    date: Date,
    name: String,
    duration: String,
    stockTicket: Number,
    priceTicket: Number,
    // id de el lugar que pertenece el tour
    place: {type: mongoose.Schema.ObjectId, ref: 'place' },
    // Servicios que incluye el tour
    service: [{type: mongoose.Schema.ObjectId, ref: 'services'}]
});

module.exports = mongoose.model('tour', tourSchema);