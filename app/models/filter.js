// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var filterSchema = mongoose.Schema({
    name : String,
    ingredients:Array,
    user:String
});


//methods


// create the model for users and expose it to our app
module.exports = mongoose.model('Filter', filterSchema);
