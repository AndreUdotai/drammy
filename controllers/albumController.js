const { body, validationResult } = require("express-validator");
const { nextTick } = require('async');
const Album = require('../models/album');
const async = require('async');
const Song = require('../models/song');

// Display list of all Albums.
exports.album_list = (req, res) => {
    async.parallel(
        {
            album(callback) {
                Album.find({}, 'name').exec(callback);
            },
            album_songs(callback) {
                Song.find({}, 'album artist')
                    .populate('album')
                    .populate('artist')
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render('album_list', {
                title: 'Album List',
                album_list: results.album,
                album_songs_list: results.album_songs,
            });
        },
    );
};

// Display detail page for a specific Album.
exports.album_detail = (req, res) => {
    async.parallel(
        {
            albums(callback) {
                Album.findById(req.params.id).exec(callback);
            },
            album_songs(callback) {
                Song.find({ album: req.params.id })
                    .populate('artist')
                    .populate('album')
                    .populate('genre')
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.albums == null) {
                // No results.
                const err = new Error('Album not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render('album_detail', {
                title: 'Album Detail',
                album: results.albums,
                album_songs: results.album_songs,
            });
        },
    );
};

// Display Album create form on GET.
exports.album_create_get = (req, res) => {
    res.render('album_form', { title: 'Create Album' });
};

// Handle Album create on POST.
exports.album_create_post = [
    // Validate and sanitize fields.
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.'),
    body('released_date', 'Invalid date of release')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Description must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('album_form', {
                title: 'Create Album',
                album: req.body,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create an Album object with escaped and trimmed data.
        const album = new Album({
            name: req.body.name,
            released_date: req.body.released_date,
            description: req.body.description,
        });
        album.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new album record.
            res.redirect(album.url);
        });
    },
];

// Display Album delete form on GET.
exports.album_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Album delete GET');
};

// Handle Album delete on POST.
exports.album_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Album delete POST');
};

// Display Album update form on GET.
exports.album_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Album update GET');
};

// Handle Album update on POST.
exports.album_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Album update POST');
};
