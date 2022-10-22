#! /usr/bin/env node

console.log('This script populates some test songs, artists, genres and albums to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

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
    released_date: released_date,
    youtube_link: youtube_link,
    artist: artist,
    album: album,
  }
  if (genre != false) songdetail.genre = genre
    
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
    released_date: released_date,
    descripton: descripton,
  }    
    
  var album = new Album(albumdetail);    
  album.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Album: ' + album);
      cb(err, null)
      return
    }
    console.log('New Album: ' + album);
    albums.push(album)
    cb(null, song)
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
        ],
        // optional callback
        cb);
}


function createSongs(cb) {
    async.parallel([
        function(callback) {
          songCreate('Essence', '9781473211896', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[0], [genres[0],], albums[0], callback);
        },
        function(callback) {
          songCreate("Young, wild and free", '9788401352836', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[0], [genres[0],], albums[0], callback);
        },
        function(callback) {
          songCreate("Fall", '9780756411336', 'https://www.youtube.com/watch?v=Wa5B22KAkEk', artists[0], [genres[0],], albums[0], callback);
        },
        function(callback) {
          songCreate("Rap God", '9780765379528', "https://www.youtube.com/watch?v=Wa5B22KAkEk", artists[1], [genres[1],], albums[0], callback);
        },
        ],
        // optional callback
        cb);
}


function createAlbums(cb) {
    async.parallel([
        function(callback) {
          albumCreate(songs[0], artists[0], 'Made in Lagos', '9781473211896', 'Best songs', callback)
        },
        function(callback) {
          albumCreate(songs[1], artists[2], 'African Giant', '9781473211896', 'Best songs', callback)
        },
        function(callback) {
          albumCreate(songs[2], artists[1], 'Freedom', '9781473211896', 'Best songs', callback)
        },
        function(callback) {
          albumCreate(songs[3], artists[3], 'Box', '9781473211896', 'Best songs', callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createGenreArtists,
    createSongs,
    createAlbums
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+albums);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



