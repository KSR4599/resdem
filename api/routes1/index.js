"use strict";
var express = require('express');
var app = express()
var expressValidator = require('express-validator');
var router = express.Router();
module.exports = router;
var ctrlAsks = require('../controllers/asks.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');
var ctrlServices = require('../controllers/services.controllers.js');
const multer = require('multer');
//var upload = multer({dest: '../resdem/views/images'})
var mongoose=require('mongoose');
var Ask= mongoose.model('Ask')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash-notification')
var User=mongoose.model('User')
var Road = mongoose.model('Road');
var hbs  = require('express-handlebars');
var path= require('path')
var asy = require("async");
var passport = require('passport')
 , LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
const nodemailer = require('nodemailer')


router.get('/allposts',function(req,res,next){
//var user=req.user;

User
 .find()
 .exec(function(err,users){
   console.log(err)
   console.log(users)
    if(err){
     console.log("Error Finding the users")
     res
      .status(500)
      .josn(err)
   }else{

   console.log("FOund users", users.length)
   res
    .render('allposts',{u:users})
  }
 })
})
