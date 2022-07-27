'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const userRoutes = require('../src/routes/user.routes');
const shoppCartRoutes = require('../src/routes/shoppCart.routes');
const placeRoutes = require('../src/routes/place.routes');
const serviceRoutes = require('../src/routes/service.routes');
const categoryPlaceRoutes = require ('../src/routes/categoryPlace.routes');
const tourRoutes = require('../src/routes/tour.routes');
const invoiceRoutes = require('../src/routes/invoice.routes'); 



const app = express(); //instancia

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/user', userRoutes);
app.use('/shoppCart', shoppCartRoutes);
app.use('/place', placeRoutes);
app.use('/service', serviceRoutes);
app.use('/categoryPlace', categoryPlaceRoutes);
app.use('/tour', tourRoutes);
app.use('/invoice', invoiceRoutes)



module.exports = app;