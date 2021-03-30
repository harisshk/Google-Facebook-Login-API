const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const TestUsers = require('./model/users')
const passportJWT = require("passport-jwt")
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
    usernamefield:'username',
    passwordField:'password'
    },
    function(username,password,cb){
         TestUsers.findOne({username, password})
           .then(user => {
               console.log("USER______",user)
            //    if (!user) {
            //        return cb(null, false, {message: 'Incorrect email or password.'});
            //    }
            console.log('------------------UserData---------', user._doc)
               return cb(null, user._doc, {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err));
}))

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.TOKEN_SECRET
},
function (jwtPayload, cb) {

    //find the user in db if needed
    return TestUsers.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));