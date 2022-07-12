'use strict'

const ShoppCartController = require('../controllers/shoppCart.controller');
const mdAuth = require('../services/authenticated');
const express = require('express');
const api = express.Router();

//RUTAS PUBLICAS
api.get('/testShoppCart', ShoppCartController.testShoppingCart);

//RUTAS PRIVADAS
//CLIENT
api.post('/addShoppCart', mdAuth.ensureAuth, ShoppCartController.addShoppCart);
api.delete('/deleteShoppCart/:id', mdAuth.ensureAuth, ShoppCartController.deleteShoppCart);
api.get('/getShoppCart/:id', mdAuth.ensureAuth, ShoppCartController.getShoppCart);

module.exports = api;