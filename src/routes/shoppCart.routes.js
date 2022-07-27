'use strict'

const ShoppCartController = require('../controllers/shoppCart.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//RUTAS PUBLICAS
api.get('/testShoppCart', ShoppCartController.testShoppingCart);

//RUTAS PRIVADAS
//CLIENT
api.post('/addShoppCart', mdAuth.ensureAuth, ShoppCartController.addToShoppingCart);
api.delete('/deleteShoppCart', mdAuth.ensureAuth, ShoppCartController.deleteShoppCart);
api.get('/confirmShoppCart', mdAuth.ensureAuth, ShoppCartController.confirmShoppCart);
api.delete('/deleteTourShoppCart/:id', mdAuth.ensureAuth, ShoppCartController.deleteTourShoppCart);


module.exports = api;