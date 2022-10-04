/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

/////////////////////////////////////////////
// Import Our Models
/////////////////////////////////////////////
const Car = require('./models/cars')

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occurred: \n", error))

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
app.use(morgan("tiny")) // This is for request logging, the "tiny" argument declares what size of morgan log to use.
app.use(express.urlencoded({ extended: true })) // this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")) // serve files from the public folder statically
app.use(express.json()) // parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running")
    // you can also send html as a string from res.send
})

// Here, we're going to set up a seed route

app.get("/cars/seed", (req, res) => {
    // array of cars
    const startCars = [
        { make:"Chevrolet", model: "truck", color: "black", quality: true},
        { make:"Ford", model: "sedan", color: "red", quality: true},
        { make:"Toyota", model: "suv", color: "green", quality: true},
        { make:"Honda", model: "mini-van", color: "blue", quality: true},
        { make:"Volkswagen", model: "sedan", color: "white", quality: true},
    ]

    // Delete every car in the db
    Car.deleteMany({})
        .then(() => {
            // seed with the starter cars array
            Car.create(startCars)
                .then(data => {
                    res.json(data)
                })
        })
})

// GET request
// index route -> shows all instances of a document in the db
app.get("/cars", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Car.find({})
        .then(cars => {
            // this is fine for initial testing
    
            // this the preferred method for APIs
            res.json({ cars: cars })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new cars
app.post("/cars", (req, res) => {
    Car.create(req.body)
        .then(car => {
            // send the user a '201 created' response, along with the new car
            res.status(201).json({ car: car.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific car
app.put("/cars/:id", (req, res) => {

    const id = req.params.id
    
    Car.findByIdAndUpdate(id, req.body, { new: true })
        .then(car => {
            console.log('the car from update', car)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


// DELETE request
app.delete("/cars/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the car
    Car.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

app.get("/cars/:id", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    const id = req.params.id
    Car.findById(id)
        .then(car => {

            res.json({ car: car })
        })
        .catch(err => console.log(err))
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END