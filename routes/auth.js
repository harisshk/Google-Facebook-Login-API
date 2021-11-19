const router = require('express').Router();
const TestUser = require('../model/users');
const passport = require("passport");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const express = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
passport.serializeUser((user, done) => {
    done(null, user);
    })
passport.deserializeUser((user, done) => {
        done(null, user)
        })
var aT=''
//stratergy
passport.use(new FacebookStrategy({
    clientID: "", // Add your clientID
    clientSecret: "", // Add the secret here
    callbackURL: 'https://153796a3fff7.ngrok.io/api/user/auth/facebook/callback'
    }, (accessToken, refreshToken, profile, done) => {
        
    return done(null, transformFacebookProfile(profile, accessToken, refreshToken));
    
    }))
    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback',  (req, res, next) => {
        console.log('--accessToken-----',aT)
        return res.redirect("msrm42app://msrm42app.io?id=" + aT);
        });



passport.use(new GoogleStrategy({
    clientID: "", 
    clientSecret: "", 
    callbackURL: ' https://153796a3fff7.ngrok.io/api/user/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        aT =accessToken
    
    return done(null, profile );
    
    }))

    router.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        }));

        router.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => {
            console.log(aT)
            return res.redirect("msrm42app://msrm42app.io?id=" + aT);
            });

router.post('/login', function (req, res, next) {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                "user"   : user,
                "err":err
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user,process.env.TOKEN_SECRET);

            return res.json({token,"username":user.username});
        });
    })
    (req, res);

});
// router.post('/login', function (req,res,next) {
//    passport.authenticate("local",{session:false},(err,user,info)=>
//    {
//     if(err || !user){
//         return res.status(400).json({
//             message:"invalid"
//         });
//     }
//     else{
//         req.logIn(user,{session:false},(err)=> {
//             if(err){
//                 res.send(err)
//             }
//             const token = jwt.sign({_id:id,username:username.username},process.env.TOKEN_SECRET);
//              res.header('auth-token',token).send(JSON.stringify({'token':token,'user':username.username},{}));
//         })(req,res)
    
//     }
    
//    })

//     //checking mail
//     // const username = await TestUser.findOne({username:req.body.username});
//     // if (!username){
//     //     return res.status(400).send("username doesn't exist");
//     // }
//     // const validatePassword = await bcrypt.compare(req.body.password,username.password);
//     // if(!validatePassword){
//     //     return res.status(400).send("Invalid password");
//     // }
//     // const id= username._id
//     // //Creating a token
//     // const token = jwt.sign({_id:id,username:username.username},process.env.TOKEN_SECRET);
//     // res.header('auth-token',token).send(JSON.stringify({'token':token,'user':username.username},{}));
// });
router.post('/register',async(req,res) => {
    //  
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
     // res.send(error)
     const user= new TestUser({
        username: req.body.username,
         password:req.body.password,
                
     });
    
     try{
         
         const savedUser = await user.save();

         res.status(200).json(savedUser);
     }
     catch(err){ 
         res.status(400).send(err);
     }
});
module.exports=router;
