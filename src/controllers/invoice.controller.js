' use strict '

const Invoice = require('../models/invoice.model');
const ShoppCart = require('../models/shoppCart.model');
const validate = require('../utils/validate');
const Tour = require('../models/tour.model');


exports.test = (req, res) => {
    return res.send({ message: 'The function test is running.' });
}

/*exports.addInvoice = async (req, res) => {
    try {
        const userId = req.user.sub;
        const shoppCart = req.params.id;
        const invoices = await Invoice.count().lean();
        const params = req.body;
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date();
        const data = {
            date: date.toLocaleDateString('es-ES', options),
            serial: invoices + 1000,
            shoppCart: req.params.id,
            NIT: params.NIT
        }
        if (params.NIT == '' || params.NIT == undefined || params.NIT == null) {
            data.NIT = 'C/F'
        }

        const msg = validate.validateData(data);
        if (msg) return res.status(400).send(msg);
        //Verificar que no exista ya una factura en ese carrito
        let invoiceExist = await validate.alreadyInvoice(data.shoppCart);
        if (invoiceExist) return res.status(400).send({ message: 'This shoppCarts already has an invoice' });
        //Verificar que exista shoppCarts
        const checkShoppCart = await ShoppCart.findOne({ _id: shoppCart });
        if (checkShoppCart === null || checkShoppCart.id != shoppCart)
            return res.status(400).send({ message: 'shoppCart not exist' });

        data.name = params.name

        const invoice = new Invoice(data);
        await invoice.save();
        return res.send({ message: 'Invoice created successfully', invoice, checkShoppCart });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error saving ShoppCart in tour' });
    }
}*/

exports.addInvoice = async (req, res)=>
{
    try
    {
        const userId = req.user.sub;
        const params = req.body;
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const shoppingCartExist = await ShoppCart.findOne({user:userId}).lean();
        if(!shoppingCartExist)
            return res.send({message:'Shopping Cart empty, add tours.'})

        const date = new Date();
        const invoices = await Invoice.count().lean();

        const shoppingCartData = 
        {
            user: shoppingCartExist.user,
            date: date.toLocaleDateString('es-ES', options),
            numberInvoice: invoices+1000,
            NIT: shoppingCartExist.NIT,
            tours: shoppingCartExist.tours,
            IVA: shoppingCartExist.IVA,
            subTotal: shoppingCartExist.subTotal,
            total: shoppingCartExist.total,
            NIT: params.NIT
        }

        if (params.NIT == '' || params.NIT == undefined || params.NIT == null) {
            shoppingCartData.NIT = 'C/F'
        }
        shoppingCartData.name = params.name

        for(var key = 0; key < shoppingCartExist.tours.length; key++)
        {
            var setTour = shoppingCartExist.tours[key].tour;
            var setTours = shoppingCartExist.tours[key];
            var tourQuantity = shoppingCartExist.tours[key].quantity;
            var tourSubTotal = shoppingCartExist.tours[key].subTotal;
            var tour = await Tour.findOne({_id:setTour});
        }

        const invoice = new Invoice(shoppingCartData);
        await invoice.save();
        
        const cleanShoppingCart = await ShoppCart.findOneAndDelete({_id:shoppingCartExist._id});
        const updateInvoice = await Invoice.findOne({_id:invoice._id});
        return res.send({message:'Invoice generated Succesfully.',updateInvoice, tour, tourQuantity, tourSubTotal});     
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}

exports.getInvoice = async (req, res) => {
    try {
        const shoppCart = req.params.id;
        //Verificar que exista la shoppCart
        const checkShoppCart = await ShoppCart.findOne({ _id: shoppCart }).populate('tours.tour').lean();
        console.log(checkShoppCart);
        if (checkShoppCart === null || checkShoppCart.id != shoppCart);
        const invoice = await Invoice.findOne({ shoppCart: shoppCart }).lean()
            .populate('shoppCart')

        if (!invoice) return res.send({ message: 'Invoice not found' });
        return res.send({ message: 'Invoice Found', invoice, checkShoppCart });
    } catch (err) {

        console.log(err);
        return res.status(500).send({ err, message: 'Error of get tour' });
    }
}



