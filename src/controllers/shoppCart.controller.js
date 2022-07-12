'use strict'

const ShoppCart = require('../models/shoppCart.model');
const Tour = require('../models/tour.model')
const validate = require('../utils/validate');

exports.testShoppingCart = (req, res)=>{
    return res.send({message: 'Function testShoppingCart is running'});
}

exports.addShoppCart = async(req, res)=>{
    try{
        const userId = req.user.sub;
        const params = req.body;
        const data = {
            tour: params.tour,
            quantity: params.quantity
        };
        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        const shoppCartExist = await ShoppCart.findOne({user: userId});
        const tourExist = await Tour.findOne({_id: params.tour}).lean();
        if(!tourExist) return res.send({message: 'Tour not found'});
        if(!shoppCartExist){
            if(params.quantity > tourExist.stockTicket) return res.send({message: 'Stock tour not available'});
            const data = {
                user: req.user.sub
            }
            const tour = {
                tour: params.tour,
                quantity: params.quantity,
                subTotal: tourExist.priceTicket * params.quantity
            }
            data.tours = tour;
            data.quantityTours = 1;
            data.total = tour.subTotal

            const shoppCart = new ShoppCart(data);
            await shoppCart.save();
            return res.send({message: 'Tour add successfully', shoppCart});
        }else{
            //ACTUALIZAR EL CARRITO
            if(params.quantity > tourExist.stockTicket) return res.send({message: 'Stock tour not available'});
            for(let tour of shoppCartExist.tours){
                console.log(tour);
                if(tour.tour != params.tour) continue;
                return res.send({message: 'Already have this tour in the shopping cart'});
            }
            const tour = {
                tour: params.tour,
                quantity: params.quantity,
                subTotal: tourExist.priceTicket * params.quantity
            }
            const total = shoppCartExist.total + tour.subTotal;
            const quantityTours = shoppCartExist.tours.length + 1;
            const pushTour = await ShoppCart.findOneAndUpdate(
                {_id: shoppCartExist._id},
                { $push: {tours: tour},
                  total: total,
                  quantityTours: quantityTours},
                {new: true}  
            )
            if(!pushTour) return res.send({message: 'Tour not add to shopping cart'});
            return res.send({message: 'New Tour add to Shopping Cart', pushTour});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving tour to shopping cart'});
    }
}

exports.deleteShoppCart = async(req, res)=>{
    try{
        const shoppCartId = req.params.id;
        const shoppCartDeleted = await ShoppCart.findOneAndDelete({_id: shoppCartId});
        if(!shoppCartDeleted) return res.status(404).send({message: 'Shopping cart not found or already deleted'});
        return res.send({message: 'Shoppin cart deleted:', shoppCartDeleted});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting shopping cart'});
    }
}

exports.getShoppCart = async(req, res)=>{
    try{
        const shoppCartId = req.params.id;
        const shoppCart = await ShoppCart.findOne({_id: shoppCartId});
        if(!shoppCart) return res.status(404).send({message: 'Shopping cart not found'});
        return res.send({message: 'Shopping cart found:', shoppCart});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting shopping cart'});
    }
}