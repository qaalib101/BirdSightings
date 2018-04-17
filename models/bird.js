var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var birdSchema = new mongoose.Schema({

    name: {            // Bird species common name e.g. "Great Horned Owl"
        type: String,
        required: [true, 'Bird name is required.'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator: function(name) {
                return name.length >= 2;   // Return true if the data is valid.
            },
            message: '{VALUE} is not a valid name, it must be at least two characters.'
        }
    },

    description: String,  // e.g. "Large brown owl"

    averageEggs: {
        type: Number,
        min: 1,
        max: 50
    },

    endangered: { type: Boolean, default: false },  // Is this bird species threatened with extinction?

    datesSeen: [  // Array of dates a bird of this species was seen
        {
            type: Date,
            required: [true, 'A date is required to add a new sighting.'],
            validate: {
                validator: function(date) {
                    return date.getTime() <= Date.now();
                },
                message: 'Date must be a valid date, and date must be now or in the past.'
            },
        }
    ],

    nest: {
        location: String,
        materials: String
    },
    height: {
        type: Number,
        validate: {
            validator: function(height) {
                return height > 1 & height < 300;   // Return true if the data is valid.
            },
            message: '{VALUE} is not a valid name, it must be at least two characters.'
        }
    }
});

var Bird = mongoose.model('Bird', birdSchema);

birdSchema.plugin(uniqueValidator);

module.exports = Bird;