const async = require('async');

const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');


exports.index = (req, res) => {
    async.parallel(
        {
            book_count(callback) {
                Book.countDocuments({}, callback);
            },
            bookinstance_count(callback) {
                BookInstance.countDocuments({}, callback);
            },
            bookinstance_available_count(callback) {
                BookInstance.countDocuments({ status: 'Available' }, callback);
            },
            author_count(callback) {
                Author.countDocuments({}, callback);
            },
            genre_count(callback) {
                Genre.countDocuments({}, callback);
            },
        },
        (err, results) => {
            res.render('index', {
                title: 'Local Library Home',
                error: err,
                data: results,
            });
        }
    );
};

exports.book_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Book list');
};

exports.book_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
};

exports.book_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create GET');
};

exports.book_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create POST');
};

exports.book_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

exports.book_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

exports.book_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update GET');
};

exports.book_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update POST');
};