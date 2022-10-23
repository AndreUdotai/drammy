const Song = require("../models/song");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Album = require("../models/album");

const async = require("async");

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
      res.render("index", {
        title: "Drammy Music Catalog",
        error: err,
        data: results,
      });
    }
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
  res.send(`NOT IMPLEMENTED: Song detail: ${req.params.id}`);
};

// Display Song create form on GET.
exports.song_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Song create GET");
};

// Handle Song create on POST.
exports.song_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Song create POST");
};

// Display Song delete form on GET.
exports.song_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Song delete GET");
};

// Handle Song delete on POST.
exports.song_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Song delete POST");
};

// Display Song update form on GET.
exports.song_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Song update GET");
};

// Handle Song update on POST.
exports.song_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Song update POST");
};