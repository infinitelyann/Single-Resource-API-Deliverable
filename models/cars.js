
///////////////////////////////////////////////////////////
// Our schema and model for the car resource
///////////////////////////////////////////////////////////
// this is the old mongoose import
// const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection')
const User = require('./user')

// here we'll import our commentSchema
const commentSchema = require('./comment')

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const { Schema, model } = mongoose

//car schema
const carSchema = new Schema({
    make: String, 
    model: String, 
    color: String,
    quality: Boolean,
    owner: {
        // here we can refer to an objectId
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line, tells us to refer to the User model
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

//make the car model
const Car = model('Car', carSchema)
/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Car