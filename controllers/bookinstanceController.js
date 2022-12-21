const { body, validationResult } = require('express-validator');

const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

exports.bookinstance_list = (req, res) => {
    BookInstance.find({}, { book: true, status: true, imprint: true, dueBack: true })
        .populate('book')
        .sort({ 'book.title': 1 })
        .exec((err, list_bookinstance, next) => {
            if (err) return next(err);
            res.render('bookinstance_list', { title: 'Copies List', bookinstance_list: list_bookinstance });
        });
};

exports.bookinstance_detail = (req, res, next) => {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec((err, bookinstance) => {
            if (err) return next(err);
            if (!bookinstance) {
                const err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            res.render('bookinstance_detail', {
                title: `Copy: ${bookinstance.book.title}`,
                bookinstance,
            });
        });
};

exports.bookinstance_create_get = (req, res, next) => {
    Book.find({}, { title: true }).exec((err, books) => {
        if (err) return next(err);
        res.render('bookinstance_form', {
            title: 'Register Copy',
            book_list: books,
        });
    });
};

exports.bookinstance_create_post = [
    body('book', 'Book must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('imprint', 'Imprint must be specified.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        const bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            dueBack: req.body.due_back,
        });
        if (!errors.isEmpty()) {
            Book.find({}, { title: true }).exec((err, books) => {
                if (err) return next(err);
                res.render('bookinstance_form', {
                    title: 'Register Copy',
                    book_list: books,
                    selected_book: bookinstance.book._id,
                    errors: errors.array(),
                    bookinstance,
                });
            })
            return;
        }
        bookinstance.save((err) => {
            if (err) return next(err);
            res.redirect(bookinstance.url);
        });
    }
];

exports.bookinstance_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

exports.bookinstance_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

exports.bookinstance_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

exports.bookinstance_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};