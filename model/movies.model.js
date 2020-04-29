const mongoose = require('mongoose');
const { genreSchema } = require('./genres.model');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
});

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    };
    return Joi.validate(movie, schema);
}

const Movie = mongoose.model('movie', movieSchema);

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validate = validateMovie;
