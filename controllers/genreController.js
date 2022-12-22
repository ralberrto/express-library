const Genre = require('../models/genre');
const Book = require('../models/book');

const { body, validationResult } = require('express-validator');
const async = require('async');


exports.genre_list = (req, res, next) => {
    Genre.find()
        .sort({ name: 1})
        .exec((err, genre_list) => {
            if (err) return next(err);
            res.render('genre_list', { title: 'Genre List', genre_list: genre_list });
        });
};

exports.genre_detail = (req, res, next) => {
    async.parallel({
        genre(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books(callback) {
            Book.find({ genre: req.params.id })
                .sort({ title: 1 })
                .exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (!results.genre) {
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', {
            title: 'Genre Detail',
            genre: results.genre,
            genre_books: results.genre_books,
        });
    });
};

exports.genre_create_get = (req, res) => {
    res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
    body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array()});
            return;
        } else {
            Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
                if (err) return next(err);
                if (found_genre) {
                    res.redirect(found_genre.url); 
                } else {
                    genre.save((err) => {
                        if (err) return next(err);
                        res.redirect(genre.url);
                    });
                }
            });
        }
    }
];

exports.genre_delete_get = (req, res, next) => {
    async.parallel({
        genre(callback) {
            Genre.findById(req.params.id, callback);
        },
        genresBooks(callback) {
            Book.find({ genre: { $elemMatch: { $eq: req.params.id } } }, callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (!results.genre) res.redirect('/catalogue/genres');
        res.render('genre_delete', {
            title: 'Delete Genre',
            genre: results.genre,
            genreBooks: results.genresBooks,
        })
    });
};

exports.genre_delete_post = (req, res, next) => {
    async.parallel({
        genre(callback) {
            Genre.findById(req.body.genreid, callback);
        },
        genresBooks(callback) {
            Book.find({ genre: { $elemMatch: { $eq: req.body.genreid} } }, callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.genresBooks.length > 0) {
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: results.genre,
                genreBooks: results.genresBooks,
            });
            return;
        }
        Genre.findByIdAndRemove(results.genre._id, (err) => {
            if (err) return next(err);
            res.redirect('/catalogue/genres');
        });
    });
};

exports.genre_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
};