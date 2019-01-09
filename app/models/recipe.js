// load the things we need
var mongoose = require('mongoose');

// define the schema for our recipe model
var recipeSchema = mongoose.Schema({

    name : String,
    ingredients:Array,
    description:String,
    user:String,
    tags:Array

});


//methods


// create the model for users and expose it to our app
module.exports = mongoose.model('Recipe', recipeSchema);
