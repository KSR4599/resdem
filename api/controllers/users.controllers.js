"use strict";
var express = require('express');
var app = express()
var mongoose = require('mongoose')
var User = mongoose.model('User')
var Road = mongoose.model('Road');
var fs= require("fs")
const multer = require('multer');
var upload = multer({dest: '../resdem/views/images/profilepics'})
const nodemailer = require('nodemailer');
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash-notification')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());







module.exports.userRegister = function(req, res){
res
 .render('register')
}

module.exports.userLogin = function(req, res){
global.user=req.user;
res.render('login')
}

module.exports.getProfile = function(req, res){
  var user=req.user;
    var id=user._id;


User
  .findById(id)
  .select('services.description')                        // User.find({_id: userId },{'library.story'}).then(function(user){
  .exec(function(err,doc){
    var response = {
         status : 200,
         message : []
       };
       if (err) {
         console.log("Error finding service");
         response.status = 500;
         response.message = err;
       } else if(!doc) {
         console.log("User id not found in database", id);
         response.status = 404;
         response.message = {
           "message" : "User ID not found " + id
         };
       } else {
         response.message = doc.services ? doc.services : [];
       }
       console.log(user.services)
       res
         .status(response.status)
         .render('profile',{des:doc,user:user.services,user1:user})
     });
 };




module.exports.getContact = function(req, res){
res
 .render('contact')
}


module.exports.newroad = function(req, res){

var lat=req.body.lat;
var lng=req.body.lng;

   Road
      .create({
         location:req.body.location,
         description:req.body.description,
         lat:lat,
         lng:lng,
         badpic:req.body.badpic,
         badvideo:req.body.badvideo
      }, function(err, road) {
        if (err) {
          console.log("Error creating road");
          res
            .status(400)
            .json(err);
        } else {
          console.log("New bad road created!", road);
          res.render('newroad',{lat:lat,lng:lng});
        }
      });
    }




module.exports.sendContact = function(req, res){
const output=`
<p> You have made a following query with us!</p>
<h3>Details:-</h3>
<ul>
 <li>Name:${req.body.name}</li>
 <li>Email:${req.body.email}</li>
 <li>Phone:${req.body.phone}</li>
 <li>Query:${req.body.query}</li>
</ul>
<h3>Query:-</h3>
<p>${req.body.query}</p>
<h4>We will look forward with your query and deliver the best support we can!</h4>
`;

// create reusable transporter object using the default SMTP transport
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

    // setup email data with unicode symbols
  /*
    let mailOptions = {
        from: '"KSR🔥" <killershell9@gmail.com>', // sender address
        to: '', // list of receivers
        subject: 'We have received your request', // Subject line
        text: 'Hello', // plain text body
        html: output // html body
    };
*/

let mailOptions = {
    from: '"KSR🔥" <killershell9@gmail.com>', // sender address
    to: 'ksreddy4599@gmail.com', // list of receivers
    subject: 'We have received a query request for BadRoads!', // Subject line
    text: 'Hello', // plain text body
    html: output // html body
};






    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         res.render('thn')
    });




}


module.exports.uploads = function(req, res){
  var user=req.user;

res
 .render('tempp',{x:'0',us:user.services,user:user});
}
