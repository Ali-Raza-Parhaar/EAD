const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../model/genres.model');
const validateObjectId = require('../middleware/validateObjectId');

// Get all genres
router.get('/', async (req, res, next) => {
    const genres =  await Genre.find().sort('name');
    res.send(genres);
});

//Get specific genre based on id
router.get('/:id', validateObjectId, async (req, res) => {


    const genre = await Genre.findOne({ _id: req.params.id });
    if (!genre) return res.status(404).send('Genre with given id was not found');
    res.send(genre);
});

// Post request to create a new genre
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
});

// Put request to update a genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                name: req.body.name
            }
        },
        { new: true }
    );

    if (!genre) return res.status(404).send('Genre with given id was not found');
    res.send(genre);
});

//Delete a genre

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findOneAndDelete({ _id: req.params.id });
    if (!genre) return res.status(404).send('Genre with given id was not found');
    res.send(genre);
});

module.exports = router;
