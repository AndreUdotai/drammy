const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    country: {
        type: String,
        required: true,
        maxLength: 100,
    },
});

//Virtual for artist's URL
ArtistSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need this object
    return `/catalog/artist/${this.id}`;
});

// Export model
module.exports = mongoose.model('Artist', ArtistSchema);