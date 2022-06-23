'use strict'

const mongoose = require('mongoose')

const userSchema = Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    email: String,
    image: String,
    role: String,
    phone: String
});

module.exports = mongoose.model('user', userSchema)