const { nextTick } = require("async");
const Album = require("../models/album");
const async = require("async");
const Song = require("../models/song");

// Display list of all Albums.
exports.album_list = (req, res) => {
  async.parallel(
    {
      album(callback) {
        Album.find({}, 'name')
          .exec(callback);
      },
      album_songs(callback) {
        Song.find({}, 'album artist' )
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
        title: "Album List",
        album_list: results.album,
        album_songs_list: results.album_songs,
      });
    }
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
      if(err) {
        return next(err);
      }
      if(results.albums == null) {
        // No results.
        const err = new Error("Album not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("album_detail", {
        title: "Album Detail",
        album: results.albums,
        album_songs: results.album_songs
      });
    }
  )
};

// Display Album create form on GET.
exports.album_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Album create GET");
};

// Handle Album create on POST.
exports.album_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Album create POST");
};

// Display Album delete form on GET.
exports.album_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Album delete GET");
};

// Handle Album delete on POST.
exports.album_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Album delete POST");
};

// Display Album update form on GET.
exports.album_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Album update GET");
};

// Handle Album update on POST.
exports.album_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Album update POST");
};