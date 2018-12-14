
var Recipe = require('../models/recipe.js');

exports.recipe_create = function(req, res) {

    const postBody = req.body;
    var name= req.body.name;
    var ingredientarray=[];
    ingredientarray= req.body.ingredient;
    var amountarray=req.body.amount;
    var description = req.body.description;
    var user = req.user;
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

        var recipe = new Recipe({name: name, ingredients: [], description: description, user:user._id});

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


exports.recipe_view_own = function(req, res) {
    var userid = req.user._id;
    Recipe.find({user:userid},function (err, docs) {
        var returnd="";
        docs.forEach(function(doc) {
          returnd+=doc.name+",";
        });
        res.send(returnd);
    });
};

exports.recipe_view_all = function(req, res) {
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

exports.recipe_random = function(req, res) {

    var result= new Recipe();
    Recipe.find(function (err, docs) {
        var returnd="";
        var searchelement="12";

        var increment=0;
        docs.forEach(function(doc) {
            var ingredient;
            increment++;
            for (let i = 0; i <doc.ingredients.length ; i++) {
                ingredient=doc.ingredients[i];
                if (ingredient.includes(searchelement)===true) {
                    delete docs[increment-1];
                }

            }
        });

        docs.forEach(function(doc) {
            returnd+=doc.name+",";
        });
        //console.log(returnd);
        var tarray = returnd.split(",");
        tarray.pop();

        var random_number =Math.round(Math.random() * (tarray.length-1));


        //console.log(tarray[random_number].name);
        //console.log(random_number+"randomnumberyo");
       // var index_length = tarray.length;

//console.log(tarray[random_number]);
        res.send(tarray[random_number]);
    });


    // render the page and pass in any flash data if it exists


};



exports.recipe_remove = function(req, res) {
    var name= req.body.recipe_name;
    var userid = req.user._id;

    Recipe.remove({name:req.params.recipetoremove,user:userid},function (err) {
        res.send(err);
    });
};