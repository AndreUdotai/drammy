const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100,
    },
    released_date: { type: Date },
    youtube_link: {
        type: String,
        required: true,
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    genre: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre',
}],
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
    },
});

//Virtual for song's URL
SongSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need this object
    return `/catalog/song/${this.id}`;
});

// Export model
module.exports = mongoose.model('Song', SongSchema);