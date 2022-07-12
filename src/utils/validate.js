'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const Service = require('../models/services.model');


exports.validateData = (data) =>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The params ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.alreadyUser = async (username)=>{
   try{
    let exist = User.findOne({username:username}).lean()
    return exist;
   }catch(err){
       return err;
   }
}

exports.encrypt = async (password) => {
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate =  async(user)=>{
    try{
        if(user.password || Object.entries(user).length === 0 || user.role)
        return false;
        else 
        return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdateAdmin = async(params)=>{
    try {
        if (Object.entries(params).length === 0 || params.password) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

 exports.deleteSensitiveData = async(data)=>{
    try{
        delete data.user.password;
        delete data.user.role;
        return data;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.validExtension = async (ext, filePath)=>{
    try{
        if( ext == 'png' ||
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'gif'){
            return true;
        }else{
            fs.unlinkSync(filePath);
            return false;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}


//-------------------------Servicios--------------------------------
exports.searchService = async(name)=>{
    try{
        const service = await Service.findOne({name: name}).lean();
        if(!service){
            return false;
        }else{
            return service;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadyService = async (name)=>{
    try{
     let exist = Service.findOne({name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
 }  

//-----------------Tour--------------------------
exports.checkUpdateTour = async (tour) => {
    if (tour.priceTicket ||
        Object.entries(tour).length === 0) {
        return false;
    } else {
        return true;
    }
}

//---------------------CategoryPlace------------------------
exports.searchCategoryPlace = async(name)=>{
    try{
        const categoryplace = await categoryPlace.findOne({name: name}).lean();
        if(!categoryplace){
            return false;
        }else{
            return categoryplace;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadycategoryPlace = async (name)=>{
    try{
     let exist = categoryPlace.findOne({name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
 }  