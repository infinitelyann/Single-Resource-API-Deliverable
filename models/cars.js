/////////////////////////////////////////////
// Our schema and model for the car
/////////////////////////////////////////////
const mongoose = require('mongoose')// import mongoose

//we're going to pull the Schema and model from mongoose
//we'll use a syntax called 'destructuring'
const { Schema, model} = mongoose

//car schema
const carSchema = new Schema({
    make: String, 
    model: String, 
    color: String,
    quality: Boolean
})

//make the car model
const Car = model('Car', carSchema)
/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Car