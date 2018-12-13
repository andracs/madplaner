var recipe_controller = require('../app/controllers/recipeController.js');
var recipe_list = require('../app/recipeList');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // Recipe ===============================
    // =====================================
    // show the login form
    app.get('/recipe', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('recipe.ejs', { message: req.flash('loginMessage'), data:{},errors:{}  } );
    });
    app.get('/create/recipe', function(req, res) {
        var Recipe            = require('../app/models/recipe');



                var recipe = new Recipe({name:"Lasagne", ingredients: [["ingredient1","amount"],["ingredient2","amount"]]});

                recipe.save(function (err, recipe) {
                    if (err) return console.error(err);

                });
        res.redirect('/recipe');

    });
    app.get('/app/createRecipe.js', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('createRecipe.js');
    });


    app.post('/recipe', recipe_controller.recipe_create
    );

    app.get('/recipe/view', recipe_controller.recipe_view

    );
    app.get('/recipelist', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('recipelist.ejs');
    });

    app.get('/app/recipeList.js', recipe_list.recipe_list
    );


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('failuremessage')
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebookauth', {
        scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebookauth', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // route for test
    app.get('/test', isLoggedIn, function (req, res) {
        res.json("test");
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('googleauth', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('googleauth', {
            successRedirect : '/profile',
            failureRedirect : '/',
            failureFlash : true // allow flash messages

        }));



    // =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authenticate('facebookauthorize', {
        scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authenticate('facebookauthorize', {
            successRedirect : '/profile',
            failureRedirect : '/profile',
            failureFlash : true // allow flash messages

        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authenticate('googleauthorize', { scope : ['profile', 'email'] }));


    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authenticate('googleauthorize', {
            successRedirect : '/profile',
            failureRedirect : '/profile',
            failureFlash : true // allow flash messages

        }));
    // =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.facebook.id    =undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.google.id    =undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}