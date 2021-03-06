const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    phone: {
        type: Number,
        required: true
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),
        isGold: Joi.boolean().required(),
        phone: Joi.number().required()
    };
    return Joi.validate(customer, schema);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;
