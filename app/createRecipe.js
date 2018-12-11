// load up the user model
var Recipe            = require('../app/models/recipe');

$(document).ready(function () {

    $("#addfield").click(function () {

        addFields();
    });

})
function createrecipe(){
    var recipe = new Recipe({name:"Lasagne"});
    recipe.save(function (err, recipe) {
        if (err) return console.error(err);

    });
}

function addFields(){
    console.log("works");
}
module.exports