'use strict'

const mongoose = require('mongoose');

const servicesSchema = Schema ({
    name: String,
    description: String,
});

module.exports = mongoose.model('services', servicesSchema);