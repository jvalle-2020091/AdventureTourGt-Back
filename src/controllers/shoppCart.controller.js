'use strict'

const ShoppingCart = require('../models/shoppCart.model');
const Tour = require('../models/tour.model');
const validate = require('../utils/validate');
const Place = require('../models/place.model');

exports.testShoppingCart = (req, res) => {
    return res.send({ message: 'Function testShoppingCart is running' });
}

exports.addToShoppingCart = async (req, res) => {
    try {

        const userId = req.user.sub;
        const params = req.body;
        const data = {
            tour: params.tour,
            quantity: params.quantity
        };
        const msg = validate.validateData(data);
        if (msg) return res.status(400).send(msg);
        const shoppingCartExist = await ShoppingCart.findOne({ user: userId });
        const tourExist = await Tour.findOne({ _id: params.tour });
        if (!tourExist) return res.status(400).send({ message: 'Tour not found' });
        if (!shoppingCartExist) {
            if (params.quantity > tourExist.stockTicket) return res.status(400).send({ message: 'Stock Tour not available' });
            if (params.quantity <= 0) return res.status(400).send({ message: 'You have to add more than 0 tickets' });
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
            data.IVA = parseFloat(tour.subTotal) * 0.12;
            data.subTotal = tour.subTotal - data.IVA;
            data.total = data.subTotal + data.IVA;

            //Se descuenta el numero de stockTickets en Tour
            const stockTour = (tourExist.stockTicket - tour.quantity)
            await Tour.findOneAndUpdate({ _id: tour.tour }, { stockTicket: stockTour }, { new: true });


            const shoppingCart = new ShoppingCart(data);
            await shoppingCart.save();
            return res.send({ message: 'Tour add successfully', shoppingCart });
        } else {
            //actualizar el carrito
            if (params.quantity > tourExist.stockTicket) return res.status(400).send({ message: 'Stock Tour not available' })
            if (params.quantity <= 0) return res.status(400).send({ message: 'You have to add more than 0 tickets' });

            /*  for(let tour of shoppingCartExist.tours){
                  if(tour.tour != params.tour) continue; 
                  return res.status(400).send({message: 'Already have this tour in the shopping cart'});
              }*/
            const tour = {
                tour: params.tour,
                quantity: params.quantity,
                subTotal: tourExist.priceTicket * params.quantity
            }
            const iva = shoppingCartExist.IVA + (tour.subTotal * 0.12);
            const subtotal = (shoppingCartExist.subTotal + tour.subTotal) - shoppingCartExist.IVA ;
            const total = shoppingCartExist.total + tour.subTotal;
            const quantityTours = shoppingCartExist.tours.length + 1;
            const pushTour = await ShoppingCart.findOneAndUpdate(
                { _id: shoppingCartExist._id },
                {
                    $push: { tours: tour },

                    subTotal: subtotal.toFixed(2),
                    IVA: iva.toFixed(2),
                    total: total.toFixed(2),
                    
                    quantityTours: quantityTours
                },
                { new: true }
            ).populate('tours.tour')

            //Se descuenta el numero de stockTickets en Tour
            const stockTour = (tourExist.stockTicket - tour.quantity)
            await Tour.findOneAndUpdate({ _id: tour.tour }, { stockTicket: stockTour }, { new: true });



            if (!pushTour) return res.status(400).send({ message: 'Tour not add to shopping cart' });
            return res.send({ message: 'New tour add to Shopping Cart', pushTour });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error saving Tour to shopping cart' });
    }
}

exports.deleteShoppCart = async (req, res) => {
    try {
        const userId = req.user.sub;
        let cleanShoppingCart = await ShoppingCart.findOneAndRemove({ user: userId }).lean();
        if (cleanShoppingCart === null) {
            return res.send({ message: 'No tienes ningun tour en tú carrito' })
        } else {
            return res.send({ message: 'Se han removido los tours de tu carrito' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error deleting shopping cart' });
    }
}

exports.confirmShoppCart = async (req, res) => {
    try {
        const userId = req.user.sub;
        let shoppingCartPreview = await ShoppingCart.findOne({ user: userId }).populate('tours.tour').lean();
        if (shoppingCartPreview === null) {
            return res.send({ message: 'No tienes ningun tour en tú carrito' })
        } else {
            return res.send({ shoppingCartPreview });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//Eliminar un tour no deseao del carrito
exports.deleteTourShoppCart = async (req, res) => {
    try {
        const userId = req.user.sub;
        const tourId = req.params.id;
        const tourExist = await ShoppingCart.findOne({ user: userId },
            { "tours._id": tourId },
            { "tours.$": true }
        )

        const deleteShopp = await ShoppingCart.findOneAndUpdate({ user: userId },
            { $pull: { tours: { _id: tourId } } },
            { new: true });
        return res.send({ message: 'Se elimino el producto correctamente', deleteShopp })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error deleting shopping cart' });
    }
}