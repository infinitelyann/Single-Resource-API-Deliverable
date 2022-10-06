///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Car = require('./car')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// This script will be run, with the command in the terminal `npm run seed`


///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter cars
    const startCars = [
        { make:"Chevrolet", model: "truck", color: "black", quality: true},
        { make:"Ford", model: "sedan", color: "red", quality: true},
        { make:"Toyota", model: "suv", color: "green", quality: true},
        { make:"Honda", model: "mini-van", color: "blue", quality: true},
        { make:"Volkswagen", model: "sedan", color: "white", quality: true},
    ]

    // delete all the existing cars
    Cars.deleteMany({})
        .then(deletedCars => {
            console.log('this is what .deleteMany returns', deletedCars)

            // create a bunch of new cars from startCars
            Cars.create(startCars)
                .then(data => {
                    console.log('here created cars', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})