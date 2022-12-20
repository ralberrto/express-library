const Author = require('../models/author');
const Book = require('../models/book');

const async = require('async');

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
    res.send('NOT IMPLEMENTED: Author create GET');
};

exports.author_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author create POST');
};

exports.author_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update POST');
};