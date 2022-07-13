'use strict'

const express = require('express');
const placeController = require('../controllers/place.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/places'});

api.post('/savePlace/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], placeController.savePlace);
api.put('/updatePlace/:idCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], placeController.updatePlace);
api.delete('/deletePlace/:idCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], placeController.deletePlace);

api.get('/getPlacesByCategory/:id', mdAuth.ensureAuth, placeController.getPlaces);
api.get('/getPlaceByCategory/:idCategory/:id', mdAuth.ensureAuth, placeController.getPlace);

api.post('/uploadImage/:id', [mdAuth.ensureAuth, upload], placeController.uploadImage);
api.get('/getImage/:fileName', upload, placeController.getImage);


module.exports = api;