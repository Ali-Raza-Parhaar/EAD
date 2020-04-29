const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental, validate } = require('../model/rentals.model');
const router = express.Router();

Fawn.init(mongoose);

const { Customer } = require('../model/customers.model');
const { Movie } = require('../model/movies.model');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    if (!rentals) return res.status(404).send('No rentals were found...');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    const movie = await Movie.findById(req.body.movieId);

    let rental = new Rental({
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        }
    });
    // try {
    //     rental = await rental.save();
    //     movie.numberInStock--;
    //     movie.save();
    //     res.send(rental);
    // } catch (ex) {
    //     res.status(500).send('Inter server error');
    // }

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update(
                'movies',
                { _id: movie._id },
                {
                    $inc: { numberInStock: -1 }
                }
            )
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send('Internal server Error...');
    }
});

module.exports = router;
