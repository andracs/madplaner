
var Recipe = require('../models/recipe.js');
var Filter = require('../models/filter.js');

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

    var filters = req.body.filters;
    var userid = "5c143382f68a5133909f7c57"//req.user._id;
    // TODO insert admin object id for filters at some points
    var forbiddenarray = [];
    var forbiddeningredients = new Promise(function(resolve, reject) {
        if (filters !== undefined) {
            filters.forEach(function (filtername) {
                Filter.find({name: filtername, user: userid}, function (err, foundfilter) {
                    foundfilter.forEach(function (filter) {
                        filter.ingredients.forEach(function (ingredient) {
                            forbiddenarray.push(ingredient[0]);

                        });
                    });

                })
            });

        }
        resolve(forbiddenarray);
     });


    forbiddeningredients.then(function(forbiddenpromise) {

        Recipe.find(function (err, recipes) {

            var searchelement=forbiddenpromise;

            var recipe_array=[];

            recipes.forEach(function(recipe) {
                var ingredient;
                recipe_array.push(recipe);

                for (let i = 0; i <recipe.ingredients.length ; i++) {
                    ingredient=recipe.ingredients[i];

                    if (searchelement.indexOf(ingredient[0])!==-1) {

                        recipe_array.pop();
                    }

                }

            });


            var random_number =Math.round(Math.random() * (recipe_array.length-1));
if(recipe_array[random_number]!==undefined){
    res.send(recipe_array[random_number].name)
}
else {
    res.send("No Recipes found");
}
        });
    });


};



exports.recipe_remove = function(req, res) {
    var name= req.body.recipe_name;
    var userid = req.user._id;

    Recipe.remove({name:req.params.recipetoremove,user:userid},function (err) {
        res.send(err);
    });
};

var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};