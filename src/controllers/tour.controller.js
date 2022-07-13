'use strict'

const Tour = require('../models/tour.model');
const Place = require('../models/place.model');
const Service = require('../models/services.model');
const Validate = require('../utils/validate');

exports.test = (req, res) => {
    return res.send({ message: 'The function test is running' });
};

//  ----------------------- Agregar Tour --------------------
exports.addTour = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            place: params.place,
            service: params.service,
            date: params.date,
            name: params.name,
            duration: params.duration,
            stockTicket: params.stockTicket,
            priceTicket: 0
        }
        const msg = Validate.validateData(data);
        if (msg) return res.status(400).send(msg);

        // Verificar la existencia del lugar
        const placeExist = await Place.findOne({ _id: params.place });
        if (!placeExist) return res.status(404).send({ message: 'Tour not found' });

        // Verificar la existencia del servicion
        const checkService = await Service.findOne({ _id: data.service }); // agruegue ;
        if (!checkService)
            return res.status(400).send({ message: 'Service not found' });

        // Guardar el Tour
        const tour = new Tour(data);
        await tour.save();
        return res.send({ message: 'Tour saved successfully', tour });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error saving Tour' });
    }
}

// ------------------------------ Acualizar Tour --------------------------
exports.updateTour = async  (req, res) => {
    try {
        // Capturar ID
        const tourId = req.params.id;
        const params = req.body;

        // Validar que vengan los datos a actualizar a esepcion del priceTicket
        const checkUpdate = await Validate.checkUpdateTour(params);
        if (checkUpdate === false)
            return res.status(400).send({ message: 'Not sending params to update or params cannot update' });

        // Validar que exitsta el lugar
        const placeExist = await Place.findOne({ _id: params.place });
        if (!placeExist) return res.send({ message: 'Place not found' });

        // Validar que exitsta el servicio
        const serviceExist = await Service.findOne({ _id: params.service });
        if (!serviceExist) return res.send({ message: 'Service not found' });

        // validar que exista el tour 
        const tourUpdated = await Tour.findOneAndUpdate({ _id: tourId }, params, { new: true })
            .lean()
            .populate('place')
            .populate('service');

        if (!tourUpdated) return res.send({ message: 'Tour does not exist or tour not updated' });

        return res.send({ message: 'Tour updated successfully', tourUpdated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error updateTour on Tour' });
    }
}

// ------------------------------ Eliminar Tour --------------------------
exports.deleteTour = async (req, res) => {
    try {
        //Capturar el ID
        const tourId = req.params.id;

        //Eliminar
        const tourDeleted = await Tour.findOneAndDelete({ _id: tourId })
            .lean()
            .populate('place')
            .populate('service');

        //Verificar la eliminación
        if (!tourDeleted) return res.status(404).send({ message: 'Tour not found or already deleted' });
        return res.send({ message: 'Tour deleted:', tourDeleted });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error deleting Tour' });
    }
}

// ------------------------------ Buscar Tours --------------------------
exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find()
            .lean()
            .populate('place')
            .populate('service');
        return res.send({ message: 'Tours found:', tours });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error getting Tours' });
    }
}

// ------------------------------ Buscar Tour --------------------------
exports.getTour = async (req, res) => {
    try {
        //Capturar el ID
        const tourId = req.params.id;

        //Validar que exista el Tour.
        const tour = await Tour.findOne({ _id: tourId })
            .lean()
            .populate('place')
            .populate('service');
        if (!tour) return res.status(404).send({ message: 'Tour not found' });

        return res.send({ message: 'Tour found:', tour });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error getting Tour' });
    }
}

// ------------------------------ Buscar Tours agotados --------------------------
exports.exhaustedTour = async (req, res) => {
    try {
        const toursExhausted = await Tour.find({ stockTicket: 0 })
            .lean()
            .populate('place')
            .populate('service');
        return res.send({ tours: toursExhausted});

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error searching tours exhausted' });
    }
}

// ------------------------------ Buscar Tours mas vendidos --------------------------
exports.mostSales = async (req, res) => {
    try {
        const toursMostSales = await Tour.find()
            .sort({ sales: -1 }) 
            .lean()
            .populate('place')
            .populate('service');
        return res.send({ tours: toursMostSales});

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error getting tours most Sales' });
    }
}

// ------------------------------ Buscar Tours por nombre --------------------------
exports.searchTour = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name
        };

        //venga la data obligatoria
        const msg = Validate.validateData(data);
        if (msg) return res.status(400).send(msg);

        const tours = await Tour.find({ name: { $regex: params.name, $options: 'i' } })
            .lean()
            .populate('place')
            .populate('service');

        return res.send({ tours });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error searching tours' });
    }
}

// ------------------------------ Buscar Tours por Lugar --------------------------
exports.tourByPlace = async (req, res) => {
    try {
        //Captura el ID del lugar
        const placeId = req.params.id;

        //Validar que exista el lugar
        const placeExist = await Place.findOne({ _id: placeId });
        if (!placeExist) return res.send({ message: 'Place not found' });

        //Buscar los los turs de ese lugar
        const tours = await Tour.find({ place: placeId })
            .lean()
            .populate('place')
            .populate('service');

        return res.send({ place: placeExist.name, tours: tours });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error searching tours by place' });
    }
}


