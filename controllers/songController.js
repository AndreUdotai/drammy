const Song = require('../models/song');
const Artist = require('../models/artist');
const Genre = require('../models/genre');
const Album = require('../models/album');

const async = require('async');

exports.index = (req, res) => {
    async.parallel(
        {
            song_count(callback) {
                Song.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            album_count(callback) {
                Album.countDocuments({}, callback);
            },
            artist_count(callback) {
                Artist.countDocuments({}, callback);
            },
            genre_count(callback) {
                Genre.countDocuments({}, callback);
            },
        },
        (err, results) => {
            res.render('index', {
                title: 'Drammy Music Catalog',
                error: err,
                data: results,
            });
        },
    );
};

// Display list of all Songs.
exports.song_list = (req, res) => {
    Song.find({}, 'title youtube_link artist')
        .sort({ title: 1 })
        .populate('artist')
        .exec(function (err, list_songs) {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render('song_list', {
                title: 'Song List',
                song_list: list_songs,
            });
        });
};

// Display detail page for a specific Song.
exports.song_detail = (req, res) => {
    Song.findById(req.params.id)
        .populate('album')
        .populate('artist')
        .populate('genre')
        .exec(function (err, song_detail) {
            if (err) {
                return next(err);
            }
            if (song_detail == null) {
                // No results
                const err = new Error('Song not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render('song_detail', {
                song_detail: song_detail,
            });
        });
};

// Display Song create form on GET.
exports.song_create_get = (req, res, next) => {
    // Get all artists, albums and genres, which we can use for adding to a song
    async.parallel(
        {
            genres(callback) {
                Genre.find(callback);
            },
            artists(callback) {
                Artist.find(callback);
            },
            albums(callback) {
                Album.find(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            res.render('song_form', {
                title: 'Add Song',
                artists: results.artists,
                genres: results.genres,
                albums: results.albums,
            });
        },
    );
};

// Handle Song create on POST.
exports.song_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('released_date', 'Invalid date of release')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('youtube_link', '').optional({ checkFalsy: true }).trim(),
    body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }),
    body('genre.*').escape(),

    body('album', '').optional({ checkFalsy: true }).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Song object with escaped and trimmed data.
        const song = new Song({
            title: req.body.title,
            released_date: req.body.released_date,
            youtube_link: req.body.youtube_link,
            artist: req.body.artist,
            genre: req.body.genre,
            album: req.body.album,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all artists, albums and genres for form.
            async.parallel(
                {
                    artists(callback) {
                        Artist.find(callback);
                    },
                    genres(callback) {
                        Genre.find(callback);
                    },
                    albums(callback) {
                        Album.find(callback);
                    }
                },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }

                    // Mark our selected genres as checked.
                    for (const genre of results.genres) {
                        if (song.genre.includes(genre._id)) {
                            genre.checked = 'true';
                        }
                    }
                    res.render('song_form', {
                        title: 'Create Song',
                        artists: results.artists,
                        genres: results.genres,
                        albums: results.albums,
                        song,
                        errors: errors.array(),
                    });
                },
            );
            return;
        }

        // Data from form is valid. Save song.
        song.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful: redirect to new song record.
            res.redirect(song.url);
        });
    },
];

// Display Song delete form on GET.
exports.song_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Song delete GET');
};

// Handle Song delete on POST.
exports.song_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Song delete POST');
};

// Display Song update form on GET.
exports.song_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Song update GET');
};

// Handle Song update on POST.
exports.song_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Song update POST');
};
