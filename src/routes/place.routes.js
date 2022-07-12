'use strict'

const express = require('express');
const placeController = require('../controllers/place.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/places'});

api.post('/savePlace', [mdAuth.ensureAuth, mdAuth.isAdmin], placeController.savePlace);
api.get('/getPlace', placeController.getPlaces);
api.put('updatePlace', placeController.updatePlace);
api.delete('deletePlace', placeController.deletePlace);


api.post('/uploadImage/:id', [mdAuth.ensureAuth, upload], placeController.uploadImage);
api.get('/getImage/:fileName', upload, placeController.getImage);


module.exports = api;