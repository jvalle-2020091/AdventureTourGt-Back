'use strict'

const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({

    NIT: String,
    name: String,
    date: String,
    numberInvoice: String,
    //client: String,
    NIT: String,
    user: {type:mongoose.Schema.ObjectId, ref: 'user'},
    tours: 
    [{
            tour: {type:mongoose.Schema.ObjectId, ref: 'tour'}, 
            quantity: Number,
            subTotal: Number
//price: Number,
            //subTotalProduct: Number
    }],
    IVA: Number,
    subTotal: Number,
    total: Number,
});

module.exports = mongoose.model('invoice', invoiceSchema)