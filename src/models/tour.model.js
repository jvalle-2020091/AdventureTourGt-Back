'use strict'

const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: String,
    duration: String,
    stockTicket: Number,
    priceTicket: Number,
    // id de el lugar que pertenece el tour
    place: {type: mongoose.Schema.ObjectId, ref: 'place' },
    // Servicios que incluye el tour
    services: [{type: mongoose.Schema.ObjectId, ref: 'service'}]
});

module.exports = mongoose.model('tour', tourSchema);