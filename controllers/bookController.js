const async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.book_create_get = (req, res, next) => {
    async.parallel(
        {
            getAuthors(callback) {
                Author.find().exec(callback);
            },
            getGenres(callback) {
                Genre.find().exec(callback);
            }
        }, (err, results) => {
            if (err) return next(err);
            res.render('book_form', {
                title: 'Create Book',
                authors: results.getAuthors,
                genres: results.getGenres,
            });
        }
    )
};

exports.book_create_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
        }
        next();
    },
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('isbn', 'ISBN must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });
        if (!errors.isEmpty()) {
            async.parallel({
                getAuthors(callback) {
                    Author.find().exec(callback);
                },
                getGenres(callback) {
                    Genre.find().exec(callback);
                }
            }, (err, results) => {
                if (err) return next(err);
                for (const genre of results.getGenres) {
                    if (book.genre.includes(genre._id)) genre.checked = true;
                }
                res.render('book_form', {
                    title: 'Create Book',
                    authors: results.getAuthors,
                    genres: results.getGenres,
                    book,
                    errors: errors.array(),
                });
            });
            return;
        }
        book.save((err) => {
            if (err) return next(err);
            res.redirect(book.url);
        });
    }
];

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