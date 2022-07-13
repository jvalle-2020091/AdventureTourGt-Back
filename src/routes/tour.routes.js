'use strict'

const tourController = require('../controllers/tour.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//RUTAS PÚBLICAS
api.get('/testProduct', tourController.test);

//RUTAS PRIVADAS 

//ADMIN
api.post('/saveTour', [mdAuth.ensureAuth, mdAuth.isAdmin], tourController.addTour);
api.put('/updateTour/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], tourController.updateTour);
api.delete('/deleteTour/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], tourController.deleteTour);
api.get('/exhaustedTour', [mdAuth.ensureAuth, mdAuth.isAdmin], tourController.exhaustedTour);

//CLIENT
api.get('/getTours', mdAuth.ensureAuth, tourController.getTours);
api.get('/getTour/:id', mdAuth.ensureAuth, tourController.getTour);
api.get('/mostSaleTour', mdAuth.ensureAuth, tourController.mostSales);
api.get('/tourByPlace/:id', mdAuth.ensureAuth, tourController.tourByPlace);
api.post('/searchTour', mdAuth.ensureAuth, tourController.searchTour);

module.exports = api;