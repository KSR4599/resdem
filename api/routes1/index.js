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
 var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


app.use(passport.initialize());
app.use(passport.session());
const nodemailer = require('nodemailer')

var googleAuth ={
  clientID : '201206374840-2bv9ni1c79mhdhnfv0c5lvmi951is56a.apps.googleusercontent.com',
  clientSecret: 'tnZYDJesYwejGmRS4DQQ4soo',
  callbackURL : 'http://localhost:3000/api1/google/callback'

}


passport.use(new GoogleStrategy({
clientID:googleAuth.clientID,
clientSecret:googleAuth.clientSecret,
callbackURL:googleAuth.callbackURL
},
function(accessToken, refreshToken,profile,done){
  process.nextTick(function(){
    User.findOne({ 'email':profile.emails[0].value},function(err,user){
      if(err){
        return done(err);
      }
      if(user){
       return done(null,user);
     }
      else {

    var newUser = new User({
  name:profile.name.familyName,
  username:profile.displayName,
  email:profile.emails[0].value,
  profileimage :'nopic.jpeg'

})
User.createUser(newUser,function(err, user){
  if(err) throw err;
  console.log(user);

  //nodemailer
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'killershell9@gmail.com', // generated ethereal user
          pass:  'KSRKILL459945'// generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
  });

  let mailOptions = {
  from: '"KSR🔥" <killershell9@gmail.com>', // sender address
  to: profile.emails[0].value, // list of receivers
  subject: '🚘 Bad Roads Registration Succesful',
    html: '<p>Thankyou for registering with us! Now you can login with your google account and Start uploading the bad roads!😎</p>'

  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  });




 return done(null,user);
})


console.log(profile);
      }
    })
  })
}
));







router.get('/google',passport.authenticate('google',{ scope: ['profile','email']}));

router.get('/google/callback',
 passport.authenticate('google',{
   successRedirect : '/api/profile',
   failureRedirect: '/'
 }));











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


router.get('/allbadroads',function(req, res,next){
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
      .render('allroads',{userx:users})
    }
   })

})
