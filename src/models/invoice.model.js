'use strict'

const mongoose = require('mongoose');

const invoiceSchema = Schema ({
    date: Date,
    serialNumber: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    nit: String,
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

module.exports = mongoose.model('invoice', invoiceSchema)