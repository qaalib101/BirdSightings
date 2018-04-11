var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
    // Query to fetch all documents, just get the name fields, sort by name
    Bird.find().select( {name: 1} ).sort( {name: 1} )
        .then( (birdDocs) => {
            console.log('All birds', birdDocs); // for debugging
            res.render('index', {title: 'All Birds', birds: birdDocs} )
        }).catch( (err) => {
        next(err);
    });
});


/* POST create new bird document */
router.post('/addBird', function(req, res, next){

    // Use form data in req.body to create new Bird
    var bird = Bird(req.body);

    // Nest the nest attributes to match the Bird schema
    bird.nest = {
        location: req.body.nestLocation,
        materials: req.body.nestMaterials
    };

    // Save the Bird object to DB as new Bird document
    bird.save().then( (birdDoc) => {
        console.log(birdDoc);   // not required, but helps see what's happening
        res.redirect('/');      // create a request to / to load the home page
    }).catch((err) => {

        if (err.name == 'ValidationError') {
            req.flash('error', err.message);
            res.redirect('/');
        }
        else if(err.code === 11000){
            req.flash('error', '${req.body.name} is already in database')
            res.redirect('/');
        }
        else {
            next(err);  // Send errors to the error handlers
        }

    });
});


/* GET info about one bird */
router.get('/bird/:_id', function(req, res, next){
    // Get the _id of the bird from req.params
    // Query DB to get this bird's document
    Bird.findOne( { _id: req.params._id} )
        .then( (birdDoc) => {
            if (birdDoc) {    // If a bird with this id is found

                // datesSeen Array is already sorted
                //birdDoc.datesSeen.sort(function(a, b) { return a.getTime() < b.getTime() });

                res.render('birdinfo', { title: birdDoc.name, bird: birdDoc } );
            } else {          // else, if bird not found, birdDoc will be undefined, which JS considers to be false
                var err = Error('Bird not found');  // Create a new Error
                err.status = 404;   // Set it's status to 404
                throw err; // Causes the chained catch function to run
            }
        })
        .catch( (err) => {
            next(err);  // 404 and database errors
        });
});


/* POST a new sighting for a bird */
router.post('/addSighting', function(req, res, next){

    Bird.findOneAndUpdate(
        { _id: req.body._id },
        { $push: { datesSeen: { $each: [req.body.date], $sort: -1 } } },
        { runValidators: true } )

        .then( (updatedBirdDoc ) => {
            if (updatedBirdDoc) {     // If no document matching this query, updatedBirdDoc will be undefined
                res.redirect(`/bird/${req.body._id}`);  // redirect to this bird's info page
            } else {
                var err = Error("Adding sighting error, bird not found");
                err.status = 404;
                throw err;
            }
        })
        .catch( (err) => {

            if (err.name === 'CastError') {
                req.flash('error', 'Date must be in a valid format');
                res.redirect(`/bird/${req.body._id}`);
            }
            else if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect(`/bird/${req.body._id}`);
            }
            else {
                next(err);
            }
        });

});

router.post('/deleteSighting', function(req, res ,next) {
    Bird.findByIdAndRemove(req.body._id)
        .then((birdDoc) => {
            if (birdDoc) {
                res.redirect('/');
            }
            else {

            }
        }).catch((err) => {
        if (err.name === 'CastError') {
            req.flash('error', 'Date must be in a valid format');
            res.redirect(`/bird/${req.body._id}`);
        }
        else if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            res.redirect(`/bird/${req.body._id}`);
        }
        else {
            next(err);
        }
    });
});



module.exports = router;