'use strict'

const mongoose = require('mongoose');

const shoppCartSchema = mongoose.Schema ({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    tickets: [
        {
            place: {type: mongoose.Schema.ObjectId, ref: 'place'},
            quantity: Number,
            subTotal: Number 
        }
    ],
    quantityPlaces: Number,
    total: Number
});

module.exports = mongoose.model('shoppCart', shoppCartSchema);