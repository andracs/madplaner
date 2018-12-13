
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


exports.recipe_view = function(req, res) {


    Recipe.find(function (err, docs) {
        var returnd="";
        //docs.name;
        console.log(docs);
        console.log(docs.name);
        docs.forEach(function(doc) {
          console.log(doc.name);
          returnd+=doc.name;
           // var table = document.getElementById("recipe_table");
           // var row = table.insertRow(0);
           // var cell1 = row.insertCell(0);
           // cell1.innerHTML = doc.name;

        });

       // res.send(returnd);
        //res.render("recipelist");
        res.send(returnd);

    });


    //console.log();
    //res.send(returnd);
   // res.send(returnd);
    //res.render("recipelist");
    //console.log(returnd);



};
