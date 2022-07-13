'use strict'

const mongoose = require('mongoose');

const categoryPlaceSchema = mongoose.Schema ({
    name: String,
    description: String,
    image: String,
    places: [
        { type: mongoose.Schema.ObjectId, ref: 'place'}
    ]
});

module.exports = mongoose.model('categoryPlace', categoryPlaceSchema);
