const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const passport = require('passport')
require("./passportConfig");
const session = require('express-session')
const bodyParser = require("body-parser")
const passportLocal = require("passport-local")
//import routes
const authRoute = require('./routes/auth');

//cors



//connect to db
mongoose.connect( process.env.DB_CONNECT,
{ useNewUrlParser: true },
() => console.log('Connected to db'))

//middleware 
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session())
app.use(session({secret:"secretkey"}))
var cors = require('cors');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// app.use(function(reaq,res,next)
// {
//     res.header("Access-Control-Allow-Origin","*")
    
// })

//routes midleware
app.use('/api/user',authRoute);

app.listen(4000,()=>console.log("Server running"))