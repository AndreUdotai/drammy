const { body, validationResult } = require("express-validator");
const { nextTick } = require("async");
const Artist = require("../models/artist");
const Song = require("../models/song");
const async = require("async");

// Display list of all artists.
exports.artist_list = (req, res) => {
    Artist.find({}, 'name')
        .sort({ name: 1 })
        .exec(function (err, list_artists) {
            if (err) {
                return next(err);
            }
            // Successful, so render
            res.render("artist_list", {
                title: "Artists List",
                artist_list: list_artists,
            });
        });
};

// Display detail page for each artist.
exports.artist_detail = (req, res) => {
    async.parallel(
        {
            artists(callback) {
                Artist.findById(req.params.id).exec(callback);
            },

            artist_songs(callback) {
                Song.find({ artist: req.params.id })
                    .populate('album')
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.artists == null) {
                const err = new Error("Artist not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render("artist_detail", {
                title: "Artist Detail",
                artist: results.artists,
                artist_songs: results.artist_songs,
            })
        }
    )
};

// Display artist create form on GET.
exports.artist_create_get = (req, res) => {
    res.render("artist_form", {title: "Create Artist"});
};

// Handle artist create on POST.
exports.artist_create_post = [
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Artist's name must be specified."),
    body("country")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Artist's country must be specified.")
        .isAlphanumeric()
        .withMessage("Country has non-alphanumeric characters."),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("artist_form", {
                title: "Create Artist",
                artist: req.body,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create an Artist object with escaped and trimmed data.
        const artist = new Artist({
            name: req.body.name,
            country: req.body.country,
        });
        artist.save((err) => {
            if (err) {
                return next(err);
            }
            // Succrssful - redirect to new artist record.
            res.redirect(artist.url);
        });
    },
];

// Display artist delete form on GET.
exports.artist_delete_get = (req, res) => {
    async.parallel(
        {
            artist(callback) {
                Artist.findById(req.params.id).exec(callback);
            },
            artist_songs(callback) {
                Song.find({ artist: req.params.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.artist == null) {
                // No results.
                res.redirect("/catalog/artists");
            }
            // Successful, so render.
            res.render("artist_delete", {
                title: "Delete Artist",
                artist: results.artist,
                artist_songs: results.artist_songs,
            });
        }
    );
};

// Handle artist delete on POST.
exports.artist_delete_post = (req, res, next) => {
    async.parallel(
        {
            artist(callback) {
                Artist.findById(req.body.artistid).exec(callback);
            },
            artist_songs(callback) {
                Song.find({ artist: req.body.artistid }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err)
            }
            // Success
            if (results.artist_songs.length > 0) {
                // Artist has books. Render in same way as for GET route.
                res.render("artist_delete", {
                    title: "Delete Artist",
                    artist: results.artist,
                    artist_songs: results.artist_song,
                });
                return;
            }
            // Artist has no songs. Delete object and redirect to the list of all artists.
            Artist.findByIdAndRemove(req.body.artistid, (err) => {
                if (err) {
                    return next(err);
                }
                // Success - go to artist list
                res.redirect("/catalog/artists");
            });
        }
    );
};

// Display artist update form on GET.
exports.artist_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist update GET");
};

// Handle artist update on POST.
exports.artist_update_post = (req, res) => {
    res.send("NOT IMPLEMENETED: Artist update POST");
};