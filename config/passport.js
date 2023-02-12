const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
        async function (req, email, password, done) {
            try {
                //find user to check
                let user = await User.findOne({ email: email });
                //if user is not found
                if (!user) {
                    console.log('Invalid username or Password');
                    return done(null, false);
                }
                //user is available, now check password
                const checkPassword = await user.isValidatePassword(password);

                if(!checkPassword){
                    console.log('Invalid username or Password');
                    return done(null,false);
                }
                //all ok return user
                return done(null,user);
            }
            catch (err) {
                console.log('Error in finding the user: ',err);

            }

        })
);

//serialize the user to keep user id in session cookie
passport.serializeUser(function(user,done){
    return done(null,user.id);
});

//deserialize the user using id stored in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){ 
            console.log('Error in finding user while deserializing: ',err);
            return done(err);
        }
        return done(null,user);
    })
});

//check for authentication
passport.checkAuthentication = function(req,res,next){
    //if logged in then pass to next()
    if(req.isAuthenticated()){
        return next();
    }
    //else redirect back
    return res.redirect(back);
};

//set authentication
passport.setAuthenticatedUser = function(req,res,next){
    //if user logged in then store in locals
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;
