'use strict'

const Place = require('../models/place.model');
const Category = require('../models/categoryPlace.model');
const { checkPermission, validateData, checkUpdate, validExtension } = require('../utils/validate');


//-----------------Guardar Lugar-----------------

exports.savePlace = async (req, res)=>{
    try{
        const categoryPlaceId = req.params.id;
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            location: params.location,
        }
        const msg = validateData(data);
        if(!msg){

            const categoryPlaceExist = await Category.findOne({ _id: categoryPlaceId})
            if(!categoryPlaceExist) return res.status(400).send({message: 'This category does not exist'});

            const checkPlace = await Place.findOne({ name: data.name }).lean()
            if (checkPlace != null) return res.status(400).send({ message: 'Ya existe un lugar con este nombre' });

            const place = new Place(data);
            const placeSaved = await place.save();
            await Category.findOneAndUpdate({_id: categoryPlaceId}, 
                {$push:
                    {places: placeSaved._id}})
            return res.send({message: 'Place saved succesfully', place});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving place'})
    }
}

//-----------------Ver lugares -----------------

exports.getPlaces = async(req, res)=>{
    try{    
        const categoryPlaceId = req.params.id;
        const categoryPlaces = await Category.findOne({_id: categoryPlaceId}).populate('places');
        return res.send({places: categoryPlaces.places});
    }catch(err){
        console.log(err);
        return err
    }
}

//---------------------Ver lugar ----------------------
exports.getPlace = async (req, res) =>{
    try{
        const categoryPlaceId = req.params.idCategory;
        const placeId = req.params.id;

        const category = await Category.findOne({_id: categoryPlaceId});
        if(!category) return res.send({ message: 'place not found en esta categoria'})

        const place = await Place.findOne({ _id: placeId});
        if(!place) return res.send({ message: 'place not found'})
        
            return res.send({ message: 'Place Found', place});
        
    }catch(err){
        console.log(err);
        return res.status(500).send({ message: 'Error getting Category'});
    }
}

//-----------------Actualizar Lugar-----------------

exports.updatePlace = async(req, res)=>{
    try{
        const categoryPlaceId = req.params.idCategory;
        const placeId = req.params.id;
        const params = req.body;
        if(Object.entries(params).length === 0)
        return res.status(400).send({message: 'Empty parameters'});

        const categoryPlaceExist = await Category.findOne({_id: categoryPlaceId });
        if(!categoryPlaceExist) return res.send({message: 'Category not found'});

        const checkPlace = await  Place.findOne({_id: placeId});
        if(checkPlace == null)return res.status(400).send({message: 'You cant update this place'});

        const check = await Place.findOne({name: params.name}).lean()
        if(check != null) return res.status(400).send({message: 'A place with the same name already exists'});

        const updatePlace = await Place.findByIdAndUpdate({_id: placeId}, params, {new: true}).lean();
        if(!updatePlace) return res.send({messaage: 'Place dont exist or not updated'});
        return res.send({message: 'Place updated successfully', updatePlace});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Failed to update place'})
    }
}




//-----------------Eliminar Lugar-----------------


exports.deletePlace = async(req, res)=>{
    try{
        const categoryPlaceId = req.params.idCategory;
        const placeId = req.params.id;

        const categoryPlaceExist = await Category.findOne({_id: categoryPlaceId });
        if(!categoryPlaceExist) return res.send({message: 'Category not found'});

        const removePlace = await Category.findOneAndUpdate({_id: categoryPlaceId}, {$pull:{places: placeId}});
        if(!removePlace) return res.status(500).send({message: 'Error removing contact'});

        const placeDeleted = await Place.findOneAndDelete({_id: placeId});
        if(!placeDeleted) return res.status(500).send({message: 'Place not found or already deleted'});
        return res.send({placeDeleted, message: 'Place deleted succesfully'});

    }catch(err){
        console.log(err);
        return err;
    }

}


//-----------------Subir imagen-----------------

exports.uploadImage = async(req, res)=>{
    try{
        const userId = req.params.id;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update'});
        const alreadyImage = await Place.findOne({_id: req.place.sub});
        let pathFile = './uploads/places/';
        if(alreadyImage.image) fs.unlinkSync(pathFile+alreadyImage.image);
        if(!req.files.image || !req.files.image.path) return res.status(400).send({message: 'Havent sent image'});
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[2];

        const extension = fileName.split('\.');
        const fileExt = extension[1];

        const validExt = await validExtension(fileExt, filePath);
        if(validExt === false) return res.status(400).send({message: 'Invalid Extension'});
        const updatePlace = await Place.findByIdAndUpdate({_id: req.place.sub}, {image: fileName}, {new: true}).lean();
        if(!updatePlace) return res.status(400).send({message: 'Place not found'});
        return res.status(200).send({message: 'Image added successfully'}, updatePlace);
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message:'Error uploading image'});
    }
}

//-----------------Ver imagen-----------------

exports.getImage = async(req, res)=>{
    try{
        const fileName = req.params.fileName;
        const pathFile = './uploads/places' + fileName;

        const image = fs.existsSync(pathFile);
        if(!image) return res.status(404).send({message: 'Image not found'});
        return res.sendFile(path.resolve(pathFile));

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting image'});
    }
}

