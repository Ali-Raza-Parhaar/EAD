const express = require('express');
const router = express.Router();

const { Customer, validate } = require('../model/customers.model');

// Get request to get all customers from database

router.get('/', async (req, res) => {
    const customer = await Customer.find();
    res.send(customer);
});

// Post request to create new customers

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    customer = await customer.save();
    res.send(customer);
});

// Get request to find one customer based on his id

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Customer with given id was not found');
    res.send(customer);
});

// Put request to update an existing customer based on id

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        },
        {
            new: true
        }
    );
    if (!customer) return res.status(404).send('Customer with given id was not found');
    res.send(customer);
});

// Delete request to delete customer based on his id

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('Customer with given id was not found');
    res.send(customer);
});

module.exports = router;
