'use strict'

const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema ({
    name: String,
    description: String,
    price: Number
});

module.exports = mongoose.model('services', servicesSchema);