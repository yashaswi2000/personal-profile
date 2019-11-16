const Joi = require('joi');
const mongoose = require('mongoose');

const Data = mongoose.model('Data',new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    department: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    phone: {
        type: String,
        requried: true,
        minlength: 10,
        maxlength: 50,
    },
    about: {
        type: String,
        required: false,
        maxlength: 1024
    },
    image: {
        type: String
    }
}));

function validateData(data) {
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).required().email(),
        department : Joi.string().min(2).max(100).required(),
        phone : Joi.string().min(10).max(50).required(),
        about : Joi.string().max(1024).allow('')
    };
    return Joi.validate(data,schema);
}

exports.Data = Data;
exports.validatedata = validateData;