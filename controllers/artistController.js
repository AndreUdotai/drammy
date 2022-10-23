const { nextTick } = require("async");
const Artist = require("../models/artist");

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
    res.send(`NOT IMPLEMENT: Artist detail: ${req.params.id}`);
};

// Display artist create form on GET.
exports.artist_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist create GET");
};

// Handle artist create on POST.
exports.artist_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist create POST");
};

// Display artst delete form on GET.
exports.artist_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist delete GET");
};

// Handle artist delete on POST.
exports.artist_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist delete POST");
};

// Display artist update form on GET.
exports.artist_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: Artist update GET");
};

// Handle artist update on POST.
exports.artist_update_post = (req, res) => {
    res.send("NOT IMPLEMENETED: Artist update POST");
};