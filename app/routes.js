var recipe_controller = require('../app/controllers/recipeController.js');
var filter_controller = require('../app/controllers/filterController.js');


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
    // Vis login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // Bruger logger ind
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // Hvis det virker send til profil
        failureRedirect : '/login', // Hvis der er en fejl send tilbage til login
        failureFlash : true // Tillad flash beskeder
    }));


    // =====================================
    // Recipe ===============================
    // =====================================
    // show the login form
    app.get('/recipe', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('recipe.ejs', { message: req.flash('loginMessage'), data:{},errors:{}  } );
    });

    app.get('/app/createRecipe.js', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('createRecipe.js');
    });


    app.post('/recipe', recipe_controller.recipe_create
    );

    app.get('/recipe/view', recipe_controller.recipe_view_own

    );
    app.get('/recipe/viewall', recipe_controller.recipe_view_all

    );
    app.get('/recipelist', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('recipelist.ejs');
    });
    app.get('/recipelistall', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('recipelistall.ejs');
    });

    app.get('/recipe/single', function(req, res, next) {

        // render the page and pass in any flash data if it exists
        res.render('recipe_single.ejs');
        next();

    });
    app.post('/recipe/single/:recipe',recipe_controller.recipe_single);

    //app.get('/recipe/single', recipe_controller.recipe_single);

    //app.get('/app/recipeList.js', recipe_list.recipe_list
    //);

    app.get('/recipe/random',  function(req, res, next) {

        // render the page and pass in any flash data if it exists
        res.render('random_recipe.ejs');

    });
    app.post('/recipe/remove/:recipetoremove', recipe_controller.recipe_remove
    );

    app.post('/recipe/random', recipe_controller.recipe_random
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
            user : req.user, // get the user out of session and pass to partials
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


    // =====================================
// Filters ==============================
// =====================================
//

    app.get('/filter/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('filters.ejs');
    });

    app.post('/filter/create', filter_controller.filter_create
    );

    app.post('/filters/viewall', filter_controller.filter_viewall
    );



    // =====================================
// TAGS ==============================
// =====================================
//

    app.get('/tag/create', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('create_tag.ejs');
    });

    app.post('/tag/create', filter_controller.tag_create
    );

    app.post('/tag/viewall', filter_controller.tag_viewall
    );






};
// Tjek om brugeren er logget in
function isLoggedIn(req, res, next) {

    // Hvis brugeren er logged ind så fortsæt til næste
    if (req.isAuthenticated())
        return next();

    // Ellers så send dem tilbage til forsiden
    res.redirect('/');
}

