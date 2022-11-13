const express = require('express');
const router = express.Router();

// Require Controller modules.
const song_controller = require('../controllers/songController');
const artist_controller = require('../controllers/artistController');
const album_controller = require('../controllers/albumController');
const genre_controller = require('../controllers/genreController');

/// SONG ROUTES ///

// GET catalog home page
router.get('/', song_controller.index);

// GET request for creating a Song. NOTE This must come before routes that display Song (uses id).
router.get('/song/create', song_controller.song_create_get);

// POST request for create Song.
router.post('/song/create', song_controller.song_create_post);

// GET request to delete Song.
router.get('/song/:id/delete', song_controller.song_delete_get);

// POST request to delete Song.
router.post('/song/:id/delete', song_controller.song_delete_post);

// GET request to update Song.
router.get('/song/:id/update', song_controller.song_update_get);

// POST request to update Song.
router.post('/song/:id/update', song_controller.song_update_post);

// GET request for one Song.
router.get('/song/:id/', song_controller.song_detail);

// GET request for list of all Songs.
router.get('/songs', song_controller.song_list);

/// ARTIST ROUTES ///

// GET request for creating Artist. NOTE This must come before route for id (i.e. display artist).
router.get('/artist/create', artist_controller.artist_create_get);

// POST request for creating Author.
router.post('/artist/create', artist_controller.artist_create_post);

// GET request to delete Author.
router.get('/artist/:id/delete', artist_controller.artist_delete_get);

// POST request to delete Author.
router.post('/artist/:id/delete', artist_controller.artist_delete_post);

// GET request to update Author.
router.get('/artist/:id/update', artist_controller.artist_update_get);

// POST request to update Author.
router.post('/artist/:id/update', artist_controller.artist_update_post);

// GET request for one Author.
router.get('/artist/:id', artist_controller.artist_detail);

// GET request for list of all Authors.
router.get('/artists', artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);


/// ALBUM ROUTES ///

// GET request for creating a Album. NOTE This must come before route that displays Album (uses id).
router.get(
    '/album/create',
    album_controller.album_create_get,
);

// POST request for creating Album.
router.post(
    '/album/create',
    album_controller.album_create_post,
);

// GET request to delete Album.
router.get(
    '/album/:id/delete',
    album_controller.album_delete_get,
);

// POST request to delete Album.
router.post(
    '/album/:id/delete',
    album_controller.album_delete_post,
);

// GET request to update Album.
router.get(
    '/album/:id/update',
    album_controller.album_update_get,
);

// POST request to update Album.
router.post(
    '/album/:id/update',
    album_controller.album_update_post,
);

// GET request for one Album.
router.get('/album/:id', album_controller.album_detail);

// GET request for list of all Album.
router.get('/albums', album_controller.album_list);

module.exports = router;
