#! /usr/bin/env node

console.log('This script populates some test songs, artists, genres and albums to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/drammy?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Song = require('./models/song')
var Artist = require('./models/artist')
var Genre = require('./models/genre')
var Album = require('./models/album')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var artists = []
var genres = []
var songs = []
var albums = []

function artistCreate(name, country, cb) {
  artistdetail = {name:name, country:country }
  
  var artist = new Artist(artistdetail);
       
  artist.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Artist: ' + artist);
    artists.push(artist)
    cb(null, artist)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function songCreate(title, released_date, youtube_link, artist, genre, album, cb) {
  songdetail = { 
    title: title,
    // released_date: released_date,
    // youtube_link: youtube_link,
    artist: artist,
    genre: genre,
    // album: album,
  }
  if (album != false) songdetail.album = album
  if (released_date != false) songdetail.released_date = released_date
  if (youtube_link != false) songdetail.youtube_link = youtube_link
    
  var song = new Song(songdetail);    
  song.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Song: ' + song);
    songs.push(song)
    cb(null, song)
  }  );
}


function albumCreate(name, released_date, descripton, cb) {
  albumdetail = { 
    name: name,
    // released_date: released_date,
    descripton: descripton,
  }
  if (released_date != false) albumdetail.released_date = released_date
    
  var album = new Album(albumdetail);    
  album.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Album: ' + album);
      cb(err, null)
      return
    }
    console.log('New Album: ' + album);
    albums.push(album)
    cb(null, album)
  }  );
}


function createGenreArtists(cb) {
    async.series([
        function(callback) {
          artistCreate('Wizkid', 'Nigeria', callback);
        },
        function(callback) {
          artistCreate('Jay Z', 'USA', callback);
        },
        function(callback) {
          artistCreate('Davido', 'Nigeria', callback);
        },
        function(callback) {
          artistCreate('Rema', 'Nigeria', callback);
        },
        function(callback) {
          artistCreate('Koffee', 'Jamaica', callback);
        },
        function(callback) {
          genreCreate("Africa", callback);
        },
        function(callback) {
          genreCreate("Hip-Hop", callback);
        },
        function(callback) {
          genreCreate("R&B", callback);
        },
        function(callback) {
          genreCreate("Ragae", callback);
        },
        ],
        // optional callback
        cb);
}

function createAlbums(cb) {
  async.parallel([
      function(callback) {
        albumCreate('Made in Lagos', '1973-06-06', 'Best songs', callback)
      },
      function(callback) {
        albumCreate('African Giant', '1973-06-06', 'Best songs', callback)
      },
      function(callback) {
        albumCreate('Freedom', '1973-06-06', 'Best songs', callback)
      },
      function(callback) {
        albumCreate('Box', '1973-06-06', 'Best songs', callback)
      },
      ],
      // Optional callback
      cb);
}


function createSongs(cb) {
    async.parallel([
        function(callback) {
          songCreate('Essence', '1973-06-06', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[0], [genres[0],], albums[0], callback);
        },
        function(callback) {
          songCreate("Young, wild and free", '1973-06-06', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[1], [genres[1],], albums[1], callback);
        },
        function(callback) {
          songCreate("Fall", '1973-06-06', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[2], [genres[2],], albums[2], callback);
        },
        function(callback) {
          songCreate("Rap God", '1973-06-06', "https://www.youtube.com/watch?v=Wa5B22KAkEk", artists[3], [genres[3],], albums[3], callback);
        },
        ],
        // optional callback
        cb);
}



async.series([
    createGenreArtists,
    createAlbums,
    createSongs
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ALBUMS: '+albums);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



