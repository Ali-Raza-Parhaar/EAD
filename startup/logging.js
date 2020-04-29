const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {

    winston.add(new winston.transports.Console({colorize: true, prettyPrint: true, handleExceptions: true}));  
    
    winston.add(new winston.transports.File({ filename: 'newError.log', handleExceptions: true}));


    winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost:27017/vidly',
    collection: 'logs',
    storeHost: true,
    options: {
        useUnifiedTopology: true
    }
    }));



    process.on('unhandledRejection', (ex) => {
    console.log('WE GOT AN UNHANDLED REJECTION');
    throw ex;
    })

}