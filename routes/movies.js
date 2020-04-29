const express = require('express');
const router = express.Router();

const { Movie, validate } = require('../model/movies.model');
const { Genre } = require('../model/genres.model');

// Get all movies
router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

//Get specific genre based on id
router.get('/:id', async (req, res) => {
    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) return res.status(404).send('Movie with given id was not found');
    res.send(movie);
});

// Post request to create a new genre
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findOne({ _id: req.body.genreId });

    if (!genre) return res.status(404).send('Genre with given id was not found');
    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        'genre._id': genre._id,
        'genre.name': genre.name
    });
    movie = await movie.save();
    res.send(movie);
});

// Put request to update a genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findOne({ _id: req.body.genreId });
    if (!genre) return res.status(404).send('Genre with given id was not found');

    const movie = await Movie.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                title: req.body.title,
                'genre._id': genre._id,
                'genre.name': genre.name
            }
        },
        { new: true }
    );

    if (!movie) return res.status(404).send('Movie with given id was not found');
    res.send(movie);
});

//Delete a genre

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id });
    if (!movie) return res.status(404).send('Movie with given id was not found');
    res.send(movie);
});

module.exports = router;
