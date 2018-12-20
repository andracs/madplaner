
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

function get_filters(filters){
    var forbiddeningredients = [];
    filters.forEach(function (filtername) {
        Filter.find({name: filtername, user: userid}, function (err, foundfilter) {
            foundfilter.forEach(function (filter) {
                // console.log(filter.ingredients);
                filter.ingredients.forEach(function (ingredient) {
                    forbiddeningredients.push(ingredient[0]);
                    console.log(forbiddeningredients+"inside");


                });
                //forbiddeningredients.push(filter.ingredients);
            });

        }).then(



        );
    });
    return forbiddeningredients;

}



exports.recipe_random = function(req, res) {

    var result = new Recipe();
    var filters = req.body.filters;
    var hello = new Filter();
    var forbiddeningredients = [];


    forbiddeningredients=get_filters(filters).then(

    );
    var userid = "5c143382f68a5133909f7c57"//req.user._id;

    var forbiddeningredients = [];
    console.log(filters);
    if (filters !== undefined) {

    filters.forEach(function (filtername) {
        Filter.find({name: filtername, user: userid}, function (err, foundfilter) {
            foundfilter.forEach(function (filter) {
                // console.log(filter.ingredients);
                filter.ingredients.forEach(function (ingredient) {
                    forbiddeningredients.push(ingredient[0]);
                    console.log(forbiddeningredients+"inside");


                });
                //forbiddeningredients.push(filter.ingredients);
            });

        }).then(



        );
    });
}
    Recipe.find(function (err, recipes) {
        //console.log(forbiddeningredients+"inside second find");
        console.log(forbiddeningredients+"outside");

        var returnd="";
        var searchelement=forbiddeningredients;

        var increment=0;
        var deleted=false;
        var recipe_array=[];
        //console.log(searchelement);
        //console.log(recipes+"first");
        recipes.forEach(function(recipe) {
            var ingredient;
            //console.log(increment+"incrementone");
            //console.log(recipes);
            recipe_array.push(recipe);

            for (let i = 0; i <recipe.ingredients.length ; i++) {
                ingredient=recipe.ingredients[i];
                //console.log(increment+"incrementsecond");
                //  console.log(searchelement+"searcheleemtn");
        //console.log(searchelement.indexOf(ingredient[0]));
                //console.log(ingredient[0]+"ingredient");

                if (searchelement.indexOf(ingredient[0])!==-1) {
                   // console.log(increment+"incrementthird");

                    // console.log(increment+"increment");
                   // console.log(recipes[increment]+"recipe");
                    //console.log(recipes[increment]+"inloop");
                    //console.log(recipe._id);
               //     var recipe_id= recipe._id;
                    recipe_array.pop();
                   // delete recipes[increment];
                    //console.log(recipes);
             //       deleted=true;
                }


            }
           // if(deleted===false){
           //     increment++;

         //   }
       //     deleted=false;


        });
       // console.log(recipe_array);
       // recipe_array.forEach(function(doc) {
       //     returnd+=doc.name+",";
       // });
        //console.log(returnd);
       // var tarray = returnd.split(",");
       // tarray.pop();

        var random_number =Math.round(Math.random() * (recipe_array.length-1));

        //res.send(tarray[random_number]);
        res.send(recipe_array[random_number].name)
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

var findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};