const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255
    }
});


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign( {_id: this.id} ,config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(255)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .required(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
