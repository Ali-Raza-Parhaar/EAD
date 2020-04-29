const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');
const express = require('express');
const app = express();
const config = require('config');

console.log(config.get('name'));

require('./startup/config')();
require('./model/db')();
require('./startup/routes')(app);
require('./startup/logging')();

app.set('view engine', 'pug');
app.set('views', './views'); 


const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening at port ${port}`));

module.exports = server;
