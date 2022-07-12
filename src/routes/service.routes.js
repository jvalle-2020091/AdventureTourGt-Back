'use strict'

const express = require('express');
const serviceController = require('../controllers/services.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/test', serviceController.test);
api.post('/saveService', mdAuth.isAdmin, serviceController.addService);
api.put('/updateService/:id',  mdAuth.isAdmin,  serviceController.updateService);
api.delete('/deleteService/:id',  mdAuth.isAdmin, serviceController.deleteService);
api.get('/getService/:id', [mdAuth.ensureAuth, mdAuth.isAdmin],serviceController.getService);
api.get('/getServices',[mdAuth.ensureAuth, mdAuth.isAdmin],  serviceController.getServices);


module.exports = api; 