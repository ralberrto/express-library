const BookInstance = require('../models/bookinstance');

exports.bookinstance_list = (req, res) => {
    BookInstance.find({}, { book: true, status: true, imprint: true, dueBack: true })
        .populate('book')
        .sort({ 'book.title': 1 })
        .exec((err, list_bookinstance, next) => {
            if (err) return next(err);
            res.render('bookinstance_list', { title: 'Copies List', bookinstance_list: list_bookinstance });
        });
};

exports.bookinstance_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
};

exports.bookinstance_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

exports.bookinstance_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

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