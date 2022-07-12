'use strict'

const express = require('express');
const categoryPlaceController = require('../controllers/categoryPlace.controller')
const api = express.Router();
const mdAuth = require('../services/authenticated');

//FUNCIÓN PÚBLICA
api.get('/test', categoryPlaceController.test);

//FUNCIONES PRIVADAS
//CLIENT
api.post('/saveCategoryPlace', mdAuth.ensureAuth, categoryPlaceController.addCategoryPlace);
api.put('/updateCategoryPlace/:id',  mdAuth.ensureAuth, categoryPlaceController.updateCategoryPlace);
api.delete('/deleteCategoryPlace/:id', mdAuth.ensureAuth, categoryPlaceController.deleteCategoryPlace);
api.get('/getCategory/:id', mdAuth.ensureAuth, categoryPlaceController.getCategory );
api.get('/getCategorys', mdAuth.ensureAuth, categoryPlaceController.getCategorys)



module.exports = api; 