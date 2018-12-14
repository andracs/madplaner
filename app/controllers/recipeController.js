
var Recipe = require('../models/recipe.js');

exports.recipe_create = function(req, res) {

    const postBody = req.body;
    var name= req.body.name;
    var ingredientarray=[];
    ingredientarray= req.body.ingredient;
    var amountarray=req.body.amount;
    var description = req.body.description;
//console.log(req.body.description);
    //console.log(postBody);
    //console.log(name+ingredientarray+amountarray);
    //["ingredient1","amount"],["ingredient2","amount"]
    // for (index = 0; index < a.length; ++index) {
    //     console.log(a[index]);
    // }

    if(ingredientarray!==undefined) {
       // console.log(ingredientarray);
        ingredientarray = ingredientarray.filter(function (el) {
            return el !== "";
        });
        amountarray = amountarray.filter(function (el) {
            return el !== "";
        });

        var recipe = new Recipe({name: name, ingredients: [], description: description});

        for (index = 0; index < ingredientarray.length; ++index) {
            recipe.ingredients.push([ingredientarray[index], amountarray[index]]);
        }

//console.log(recipe);
        recipe.save(function (err, recipe) {
            if (err) return console.error(err);

        });
    }
    res.render("recipe");
};


exports.recipe_view = function(req, res) {
    Recipe.find(function (err, docs) {
        var returnd="";
        docs.forEach(function(doc) {
          returnd+=doc.name+",";
        });
        res.send(returnd);
    });
};

exports.recipe_single = function(req, res) {
var recipename= req.params.recipe;
var result= new Recipe();
    Recipe.findOne({ name: recipename }, function (err, recipe) {
        result.name=recipename;
        result.ingredients=recipe.ingredients;
        result.description=recipe.description;
//result.push(recipename);
//result.push(recipe.ingredients);

        //console.log(recipe.ingredients);
        //console.log(result);
        res.send(result);

    });


        // render the page and pass in any flash data if it exists


};
