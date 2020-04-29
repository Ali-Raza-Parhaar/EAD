const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcryptjs = require('bcryptjs');
const express = require('express');
const { User, validate } = require('../model/users.model');
const router = express.Router();


router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with given id was not found..');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered...');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        },
        { new: true }
    );
    res.send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    res.send(user);
});

module.exports = router;
