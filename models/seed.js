
///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Car = require('./cars')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// This script will be run, with the command in the terminal `npm run seed`

// router.get("/seed", (req, res) => {
//     // array of starter cars

//     // Delete every car in the db
//     car.deleteMany({})
//         .then(() => {
//             // seed with the starter car array
//             Car.create(startCars)
//                 .then(data => {
//                     res.json(data)
//                 })
//         })
// })

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter cars
    const startCars = [
        { make:"Chevrolet", color: "black", quality: true},
        { make:"Ford", color: "red", quality: true},
        { make:"Toyota", color: "green", quality: true},
        { make:"Honda", color: "blue", quality: true},
        { make:"Volkswagen", color: "white", quality: true},
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