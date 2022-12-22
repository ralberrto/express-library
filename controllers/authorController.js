const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.author_list = (req, res, next) => {
    Author.find()
        .sort({ 'family_name': 1 })
        .exec((err, author_list) => {
            if (err) return next(err);
            res.render('author_list', { title: 'Author List', author_list: author_list });
        });
};

exports.author_detail = (req, res, next) => {
    async.parallel(
        {
            getAuthor(callback) {
                Author.findById(req.params.id).exec(callback);
            },
            getBooks(callback){
                Book.find({ author: req.params.id }, { title: true, summary: true })
                .sort({ title: 1 })
                .exec(callback);
            }
        },
        (err, results) => {
            if (err) return next(err);
            if (!results.getAuthor) {
                const err = new Error('Author not found');
                err.status = 404;
                return next(err);
            }
            res.render('author_detail', {
                title: 'Author Detail',
                author: results.getAuthor,
                authorBooks: results.getBooks,
            });
        }
    );
};

exports.author_create_get = (req, res) => {
    res.render('author_form', { title: 'Create Author' });
};

exports.author_create_post = [
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth.')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death.')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('author_form', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array(),
            });
            return;
        }
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });
        author.save((err) => {
            if (err) return next(err);
            res.redirect(author.url);
        });
    }
]

exports.author_delete_get = (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
            Book.find({ author: req.params.id }, callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (!results.author) res.redirect('/catalogue/authors');
        res.render('author_delete', {
            title: 'Delete Author',
            author: results.author,
            author_books: results.authors_books,
        });
    });
};

exports.author_delete_post = (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.body.authorid).exec(callback);
        },
        authors_books(callback) {
            Book.find({ author: req.body.authorid }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.authors_books.length > 0) {
            res.render('author_delete', {
                title: 'Delete Author',
                author: results.author,
                author_books: results.authors_books,
            });
            return;
        }
        Author.findByIdAndRemove(req.body.authorid, (err) => {
            if (err) return next(err);
            res.redirect('/catalogue/authors');
        });
    });
};

exports.author_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update POST');
};