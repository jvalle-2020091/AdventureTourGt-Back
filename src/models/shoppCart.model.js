'use strict'

const mongoose = require('mongoose');

const shoppingCartSchema = mongoose.Schema ({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    tours: [
        {
            tour: {type: mongoose.Schema.ObjectId, ref: 'Tour'},
            quantity: Number,
            subTotal: Number 
        }
    ],
    quantityTours: Number,
    total: Number
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);