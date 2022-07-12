'use strict'

const Service = require('../models/services.model');
const validate = require('../utils/validate')

exports.test = async (req, res) => {
    await res.send({ message: 'Controller run' })
}


exports.addService = async(req,res)=>{
    try{
        const params = req.body;
        const data={
            name: params.name,
            description: params.description,
            price: params.price
        }
        const msg = validate.validateData(data);
        if(!msg){
            const service = new Service(data);
            await service.save();
            return res.send({message: 'Service created succesfully'});
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Faliled to save service'})
    }
}

exports.updateService = async(req,res)=>{
    try{
        const serviceId = req.params.id;
        const params = req.body;
        if(Object.entries(params).length === 0)
            return res.status(400).send({message: 'Empty parameters'});
        const serviceExist = await Service.findOne({_id: serviceId});
        if(!serviceExist)
            return res.send({message: 'Service not found'});
        const alreadyService = await validate.searchService(params.name);
        if (alreadyService && serviceExist.name != alreadyService.name)
            return res.send({ message: 'Service already taken' });
        const updateService = await Service.findOneAndUpdate({ _id: serviceId }, params, { new: true });
        if (!updateService)
            return res.send({ message: 'Service not updated' });
        return res.send({ message: 'Service updated succesfully', updateService });
    }catch (err){
        console.log(err);
        return res.status(500).send({err,message: 'Error updating Service'})
    }
}

exports.deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const serviceExist = await Service.findOne({ _id: serviceId });
        if (!serviceExist) return res.send({ message: 'Service not found or already deleted' });
        const serviceDeleted = await Service.findOneAndDelete({ _id: serviceId });
        if (!serviceDeleted) return res.send({ message: 'Service not deleted or already deleted' });
        return res.send({ message: 'Service Deleted succesfully', serviceDeleted });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error deleting service' });
    }
};

exports.getService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findOne({ _id: serviceId });
        if (!service) {
            return res.send({ message: 'service not found' });
        } else {
            return res.send({ messsage: 'service found', service });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting serviece' });
    }
}

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        if (!services) {
            return res.send({ message: 'Service not found' });
        } else {
            return res.send({ messsage: 'Servicea found:', services });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting services' });
    }
}

