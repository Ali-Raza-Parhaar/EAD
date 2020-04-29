
const express = require('express');
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const {User} = require('../model/users.model');
const router = express.Router();



router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send('Invalid email or password...');

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password...');

    const result = await bcryptjs.compare(req.body.password, user.password);
    if (!result) return res.status(400).send('Invalid email or password...');


    const token =  user.generateAuthToken();// jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));

    res.send(token);

})




function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema)
}
module.exports = router;
