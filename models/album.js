const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    released_date: { type: Date },
    description: {
        type: String,
        required: true,
    },
});

//Virtual for album's URL
AlbumSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need this object
    return `/catalog/album/${this.id}`;
});

// Export model
module.exports = mongoose.model('Album', AlbumSchema);