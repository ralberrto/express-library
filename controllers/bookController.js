const Book = require('../models/book');

exports.index = (req, res) => {
    res.send("NOT IMPLEMENTED: Site Home Page");
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