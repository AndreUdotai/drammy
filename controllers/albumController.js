const Album = require("../models/album");

// Display list of all Album.
exports.album_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Album list");
};

// Display detail page for a specific Album.
exports.album_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Album detail: ${req.params.id}`);
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