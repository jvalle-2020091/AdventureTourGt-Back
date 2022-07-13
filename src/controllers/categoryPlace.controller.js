'use strict'

const validate = require('../utils/validate');
const categoryP = require('../models/categoryPlace.model');


exports.test = (req, res) => {
    return res.send({ message: 'Function CategoryPlace is running'});
};

exports.addCategoryPlace = async (req, res) => {
    try{

    const params = req.body;
    const data = {
        name: params.name,
        description: params.description,
    }
    const msg = validate.validateData(data);
    if(!msg){
        
        const checkCategory = await categoryP.findOne({ name: data.name }).lean()
        if (checkCategory != null) return res.status(400).send({ message: 'Ya existe una categoria con este nombre' });

        const catPlace = new categoryP(data);
        await catPlace.save();
        return res.send({ message: 'Category created successfully', catPlace})
    } else {
        return res.status(400).send(msg);
    }
    }catch(err){
        console.log(err);
        return res.status(500).send({ err, message: 'Failed to save Category Place'});
    }
}

exports.updateCategoryPlace = async (req, res) =>{
    try{

    const categoryPlaceId = req.params.id;
    const params = req.body;
    if(Object.entries(params).length === 0)
        return res.status(400).send({message: 'Empty parameters'});
    const categoryPlaceExist = await categoryP.findOne({ _id: categoryPlaceId});
    if(!categoryPlaceExist)
    return res.send({ message: 'Category not found'});

    const checkCategory = await categoryP.findOne({ name: params.name }).lean()
        if (checkCategory != null) return res.status(400).send({ message: 'Ya existe una categoria con este nombre' });

    const updateCategoryPlace = await categoryP.findByIdAndUpdate({_id: categoryPlaceId}, params, {new: true}).lean();
    if(!updateCategoryPlace) return res.send({messaage: 'CategoryPlace dont exist or not updated'});
    return res.send({message: 'CategoryPlace updated successfully', updateCategoryPlace});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating Category'})
    }


}

exports.deleteCategoryPlace = async (req, res) => {
    try{
        const categoryId = req.params.id;
        const categoryExist = await categoryP.findOne({ _id: categoryId})
        if (!categoryExist) return res.send({ message: 'Category not found or already deleted'});
        const categoryDeleted = await categoryP.findOneAndDelete({ _id: categoryId});
        if(!categoryDeleted) return res.send({message: 'Category not deleted or already deleted'});
        return res.send({message: 'Category Deleted successfully', categoryDeleted});

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting Category'})
    }
}

exports.getCategory = async (req, res) =>{
    try{
        const categoryId = req.params.id;
        const category = await categoryP.findOne({ _id: categoryId});
        if(!category) {
            return res.send({ message: 'Category not found'})
        } else{
            return res.send({ message: 'Category Found', category});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({ message: 'Error getting Category'});
    }
}

exports.getCategorys = async (req,res) => {
    try{
        const categorys = await categoryP.find();
        if(!categorys){
            return res.send({message: 'Categorys not found'})
        }else{
            return res.send({message: 'Categorys found', categorys})
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting categorys'});
    }
}