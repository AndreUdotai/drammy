const Song = require("../models/song");

exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all Song.
exports.song_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Song list");
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