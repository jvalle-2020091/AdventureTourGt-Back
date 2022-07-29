' use strict '

const Invoice = require('../models/invoice.model');
const ShoppCart = require('../models/shoppCart.model');
const validate = require('../utils/validate');
const Tour = require('../models/tour.model');


exports.test = (req, res) => {
    return res.send({ message: 'The function test is running.' });
}


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

         //Se descuenta el numero de stockTickets en Tour
         const stockTour = (tour.stockTicket - tourQuantity)
         await Tour.findOneAndUpdate({ _id: setTour }, { stockTicket: stockTour }, { new: true });
        
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

exports.getInvoices = async (req, res) => {
    try{
        const invoices = await Invoice.find().populate('tours.tour');
        if (!invoices) {
            return res.send({ message: 'Invoices not found' });
        } else {
            return res.send({ messsage: 'Invoices found:', invoices });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error of get invoices' });
    }
}





