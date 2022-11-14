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
                    .populate('album')
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
exports.album_delete_get = (req, res, next) => {
    async.parallel(
        {
            album(callback) {
                Album.findById(req.params.id).exec(callback);
            },
            album_songs(callback){
                Song.find({ album: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results.album == null){
                // No results
                res.redirect("/catalog/albums");
            }
            // Successful, so render,
            res.render("album_delete", {
                title: "Delete Album",
                album: results.album,
                album_songs: results.album_songs,
            });
        }
    );
};

// Handle Album delete on POST.
exports.album_delete_post = (req, res, next) => {
    async.parallel(
        {
            album(callback){
                Album.findById(req.body.albumid).exec(callback);
            },
            album_songs(callback){
                Song.find({ album: req.body.album }).exec(callback);
            },
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            // Success
            if(results.album_songs.length > 0){
                // Album has songs. Render in same was as for GET route.
                res.render("album_delete", {
                    title: "Delete Album",
                    album: results.album,
                    album_songs: results.album_songs,
                });
                return;
            }
            // Album has no songs. Delete object and redirect to the list of albums.
            Album.findByIdAndRemove(req.body.albumid, (err) => {
                if (err) {
                    return next(err);
                }
                // Success - go to the album list
                res.redirect("/catalog/albums")
            });
        }
    );
};

// Display Album update form on GET.
exports.album_update_get = (req, res, next) => {
    // Get album for the form
    Album.findById(req.params.id, (err, album) => {
        if(err) {
            return next(err)
        }
        if(album == null) {
            // No results
            const err = new Error('Album not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('album_form', {
            title: 'Update Album',
            album: album,
        })
    })
};

// Handle Album update on POST.
exports.album_update_post = [
    // Validate and sanitize the name field.
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

        // Create an album object with escaped and trimmed data (and the old id!)
        let album = new Album({
            name: req.body.name,
            released_date: req.body.released_date,
            description: req.body.description,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('album_form', {
                title: 'Update Album',
                album: album,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            Album.findByIdAndUpdate(
                req.params.id,
                album,
                {},
                (err, thealbum) => {
                    if (err) {
                        return next(err);
                    }
                    // Successful - redirect to album detail page.
                    res.redirect(thealbum.url);
                },
            );
        }
    },
];