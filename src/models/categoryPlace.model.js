'use strict'

const mongoose = require('mongoose');

const categoryPlaceSchema = Schema ({
    name: String,
    description: String,
    image: String,
    place: [{ type: mongoose.Schema.ObjectId, ref: 'place'}]
});

module.exports = mongoose.model('categoryPlace', categoryPlaceSchema);
