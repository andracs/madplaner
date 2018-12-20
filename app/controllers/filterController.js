var Filter = require('../models/filter.js');


exports.filter_create = function(req, res) {

    const postBody = req.body;
    var name= req.body.name;
    var ingredientarray=[];
    ingredientarray= req.body.ingredient;
    var user = req.user;

    if(ingredientarray!==undefined) {
        // console.log(ingredientarray);
        ingredientarray = ingredientarray.filter(function (el) {
            return el !== "";
        });


        var filter = new Filter({name: name, ingredients: [], user:user._id});

        for (index = 0; index < ingredientarray.length; ++index) {
            filter.ingredients.push([ingredientarray[index]]);
        }

//console.log(recipe);
        filter.save(function (err, recipe) {
            if (err) return console.error(err);

        });
    }
    res.render("recipe");
};


exports.filter_viewall = function(req, res) {

    Filter.find(function (err, docs) {
        var returnd=[];
        docs.forEach(function(doc) {
            returnd.push(doc.name);
        });
        res.send(returnd);
        //res.render("/recipe/random");
    });

};