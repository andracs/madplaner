// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1167978613352295', // your App ID
        'clientSecret'  : '928d1da30fb74b44510c80eea9c6803b', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
    'facebookAuthorize' : {
        'clientID'      : '1167978613352295', // your App ID
        'clientSecret'  : '928d1da30fb74b44510c80eea9c6803b', // your App Secret
        'callbackURL'   : 'http://localhost:8080/connect/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
    'googleAuth' : {
        'clientID'      : '917888462950-9nnp3q81grg5vjpgoqidupbvcfinm9fa.apps.googleusercontent.com',
        'clientSecret'  : '35XkvRfdiByVpNmJITQSd16E',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },
    'googleAuthorize' : {
        'clientID'      : '917888462950-9nnp3q81grg5vjpgoqidupbvcfinm9fa.apps.googleusercontent.com',
        'clientSecret'  : '35XkvRfdiByVpNmJITQSd16E',
        'callbackURL'   : 'http://localhost:8080/connect/google/callback'
    }

};