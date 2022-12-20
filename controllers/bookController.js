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

exports.book_list = (req, res, next) => {
    Book.find({}, { title: true, author: true })
        .sort({ title: 1 })
        .populate('author')
        .exec((err, list_books, next) => {
            if (err) return next(err);
            res.render('book_list', { title: 'Book List', book_list: list_books });
        });
};

exports.book_detail = (req, res, next) => {
    async.parallel({
        getBook(callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        getBookinstances(callback) {
            BookInstance.find({ book: req.params.id }).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.getBook) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail', {
            title: results.getBook.title,
            book: results.getBook,
            bookinstances: results.getBookinstances,
        });
    });
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