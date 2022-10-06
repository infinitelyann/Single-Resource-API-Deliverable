////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Car = require("../models/cars")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Car.find({})
        .populate("comments.author", "username")
        .then(cars => {
            // this is fine for initial testing
            // res.send(cars)
            // this the preferred method for APIs
            res.json({ cars: cars})
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new cars
router.post("/", (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our cars
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    // we'll use the mongoose model method `create` to make a new car
    Car.create(req.body)
        .then(car=> {
            // send the user a '201 created' response, along with the new car
            res.status(201).json({ car: car.toObject() })
        })
        .catch(error => console.log(error))
})

// GET request
// only cars owned by logged in user
// we're going to build another route, that is owner specific, to list all the cars owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the cars, by ownership
    Car.find({ owner: req.session.userId })
    // then display the cars
        .then(cars => {
            res.status(200).json({ cars: cars })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// PUT request
// update route -> updates a specific car
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Car.findById(id)
        .then(car => {
            if (car.owner == req.session.userId) {
                res.sendStatus(204)
                return car.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})

// DELETE request
// destroy route -> finds and deletes a single resource(car)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the car
    // Car.findByIdAndRemove(id)
    Car.findById(id)
        .then(car => {
            // we check for ownership against the logged in user's id
            if (car.owner == req.session.userId) {
                // if successful, send a status and delete the car
                res.sendStatus(204)
                return car.deleteOne()
            } else {
                // if they are not the user, send the unauthorized status
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Car.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(cars => {
            res.json({ car: car })
        })
        .catch(err => console.log(err))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router