
var Recipe = require('../models/recipe.js');

exports.recipe_create = function(req, res) {

    const postBody = req.body;
    var name= req.body.name;
    var ingredientarray= req.body.ingredient;
    var amountarray=req.body.amount;

    console.log(postBody);
    console.log(name+ingredientarray+amountarray);
    //["ingredient1","amount"],["ingredient2","amount"]
    // for (index = 0; index < a.length; ++index) {
    //     console.log(a[index]);
    // }
    var recipe = new Recipe({name:name, ingredients: []});
    for (index = 0; index < ingredientarray.length; ++index) {
        recipe.ingredients.push([ingredientarray[index],amountarray[index]]);
    }
recipe.ingredients.push([ingredientarray[1],amountarray[1]]);
console.log(recipe);

    recipe.save(function (err, recipe) {
        if (err) return console.error(err);

    });
    res.render("recipe");
};

