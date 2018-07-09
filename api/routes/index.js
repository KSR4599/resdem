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

var upload = multer(
  {
  storage : multer.diskStorage({
    destination : function(req, file, next){
      next(null,'../resdem/views/images/badvideos');
    },
  filename: function(req, file, next){
    const ext = file.mimetype.split('/')[1];
    var user=Date.now();
    //next(null,file.fieldname + '-'+ Date.now()+'.'+ext);
    next(null,user+'vid'+'.'+ext);
  }

  }),
}

);


//multer conf for profile pic

const multerConf = {
  storage : multer.diskStorage({
    destination : function(req, file, next){
      next(null,'../resdem/views/images/profilepics');
    },
  filename: function(req, file, next){
    const ext = file.mimetype.split('/')[1];
    var user=Date.now();
    //next(null,file.fieldname + '-'+ Date.now()+'.'+ext);
    next(null,user+'prof'+'.'+ext);
  }

  }),
  fileFilter: function(req, file, next){
    if(!file){
      next();
    }
    const image= file.mimetype.startsWith('image/');
    if(image){
      next(null, true);
    }else{
      next({message: "File type not supported"},false);
    }
  }
};

//multer conf for bad pic

const multerConf1 = {
  storage : multer.diskStorage({
    destination : function(req, file, next){
      next(null,'../resdem/views/images/badpics');
    },
  filename: function(req, file, next){
    const ext = file.mimetype.split('/')[1];
    var user=Date.now();
    //next(null,file.fieldname + '-'+ Date.now()+'.'+ext);
    next(null,user+'badpic'+'.'+ext);
  }

  }),
  fileFilter: function(req, file, next){
    if(!file){
      next();
    }
    const image= file.mimetype.startsWith('image/');
    if(image){
      next(null, true);
    }else{
      next({message: "File type not supported"},false);
    }
  }
};

//multer conf for bad video
const multerConf2 = {
  storage : multer.diskStorage({
    destination : function(req, file, next){
      next(null,'../resdem/views/images/badvideos');
    },
  filename: function(req, file, next){
    const ext = file.mimetype.split('/')[1];
    var user=Date.now();
    //next(null,file.fieldname + '-'+ Date.now()+'.'+ext);
    next(null,user+'badvid'+'.'+ext);
  }

  }),
  fileFilter: function(req, file, next){
    if(!file){
      next();
    }
    const video= file.mimetype.startsWith('video/');
    if(video){
      next(null, true);
    }else{
      next({message: "File type not supported"},false);
    }
  }
};

//end of multerr


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.render("errorauth");
}

router.get('/temp',function(req,res,next){
  var user=req.user;
  var id=user._id;
  res.render('temp',{id})
})


router.get('/tempp',function(req,res,next){
  res.render('tempp');
})

router.get('/uploadtemp',function(req,res,next){
  res.render('tempp');
})

router.post('/uploadtemp1',upload.any(),function(req,res,next){
  res.render('tempp');
})


//ask routes
router.get('/logout',function(req,res,next){
  req.logout();
  req.flash('logout','You have been successfully logged out of your account!',false) //for redirecting and flash, we are using modal
  res.redirect('./login');
})

router.get('/wronglogin',function(req, res,next){
  res.render('wronglogin')
})



router.get('/donate',ensureAuthenticated,function(req, res,next){
  res.render('donate')
})


router.get('/uploads',function(req, res){
var user=req.user;
res.render('uploads',{user:user.services,us:user});
});

router.post('/uploads',multer(multerConf2).single('badvideo'),function(req, res){
  var user=req.user;
  var id=user._id;


  if(req.file){
    console.log('Bad vid Uploaded');
    var badvideo = req.file.filename;
  }else{
    console.log('No bad vid Uploaded');
    var badvideo ='novid.mp4';
  }


  User
    .findById(id)
    .select('-services')
    .exec(function(err, user) {
      if (err) {
        console.log("Error finding user");
        res
          .status(500)
          .json(err);
          return;
      } else if(!user) {
        console.log("userid not found in database", id);
        res
          .status(404)
          .json({
            "message" : "USer ID not found " + id
          });
          return;
      }

     //user.badvideo=req.file.filename;



      user
        .save(function(err, userUpdated) {
             res
              .status(204)
              .render('uploads',{user:user.services,us:user})

        });
});
 })



 //end of uploads



router.get('/addbadroad', ensureAuthenticated,function(req, res,next){
  res.render('addbadroad')
})

//Code for servicesAddOne
var _addService = function (req, res, road) {
  var lat=req.body.lat;
  var lng=req.body.lng;
  var badpic = req.file.filename;
  road.services.push({
    description :  req.body.description,
    badpic: badpic,
    //badvideo:req.body.badvideo,
    location:[ req.body.lat, req.body.lng],
    status:'queued'
  });

  road.save(function(err, roadUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(200)
        .render('newroad',{lat:lat,lng:lng})
    }
  });

};




router.post('/newroad',multer(multerConf1).single('badpic'),function(req, res,next){

  var user=req.user;
  var id=user._id;
  var lat=req.body.lat;
  var lng=req.body.lng;
  var description= req.body.description;


  if(req.file){
    console.log('Bad pic Pic Uploaded');
    var badpic = req.file.filename;
  }else{
    console.log('No bad pic Uploaded');
    var badpic ='nopic.jpeg';
  }

//var badvideo=req.body.filename;

  User
    .findById(id)
    .select('services')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding service");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("serviceid not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Service ID not found " + id
        };
      }
      if (doc) {
          _addService(req, res, doc);
      } else {
        req.flash('error','Oops! Something went wrong');
        res
         .render('err')
     }
    });

        });



router.post('/charge',function(req, res,next){

})

router.get('/',function(req, res,next){
  res.render('index')
})

router
  .route('/asks')
  .get(ctrlAsks.asksGetAll)
  .post(ctrlAsks.asksAddOne)

router
  .route('/asks/:askid')
  .get(ctrlAsks.asksGetOne)
  .put(ctrlAsks.asksUpdateOne)
  .delete(ctrlAsks.asksDeleteOne)

  router
   .route('/profile')
   .get(ensureAuthenticated,ctrlUsers.getProfile)

router
 .route('/gpic')
 .get(ctrlAsks.askPic)

 router
  .route('/askname')
  .get(ctrlAsks.askName)

  router
   .route('/contact')
   .get(ensureAuthenticated,ctrlUsers.getContact)
   .post(ensureAuthenticated,ctrlUsers.sendContact)
 router
  .route('/register')
  .get(ctrlUsers.userRegister)

/*
  router.post('/register',multer(multerConf).single('profileimage'),function(req, res,next){
    var name= req.body.name;
    var email = req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var password2=req.body.password2;
    if(req.file){
      console.log('Profile Pic Uploaded');
      var profileimage = req.file.filename;
    }else{
      console.log('No Profile pic Uploaded');
      var profileimage ='nopic.jpeg';
    }
    //form validation
    req.checkBody('password2','passwords do not match'). equals(req.body.password);
    //Check Errors
    var errors=req.validationErrors();
  if(password!==password2){
    res.render('register',{
      errors:'Passwords Do not match!'
    });
  }
    else{
      var newUser = new User({
        username:username,
        name: name,
        email:email,
        password:password,
        profileimage:profileimage
      })
      User.createUser(newUser,function(err, user){
        if(err) throw err;
        console.log(user);
      })
      req.flash('Success:-', 'You are now registered and can Login!',false);
       res.redirect('/api/');
  }
})
*/
router.post('/register',multer(multerConf).single('profileimage'),function(req, res,next){

  var name= req.body.name;
  var email = req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var password2=req.body.password2;

  User.findOne({ 'email': req.body.email}, function(err, user) {
    if(user){
      res.render('register',{x:3});
    }
    else{



  if(req.file){
    console.log('Profile Pic Uploaded');
    var profileimage = req.file.filename;
  }else{
    console.log('No Profile pic Uploaded');
    var profileimage ='nopic.jpeg';
  }

  //form validation
  req.checkBody('password2','passwords do not match'). equals(req.body.password);
  //Check Errors
  var errors=req.validationErrors();
if(password!==password2){
  res.render('register',{
    errors:'Passwords Do not match!'
  });
}
  else{

    var newUser = new User({
      username:username,
      name: name,
      email:email,
      password:password,
      profileimage:profileimage
    })
    User.createUser(newUser,function(err, user){
      if(err) throw err;
      console.log(user);

    })


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
    to: email, // list of receivers
    subject: '🚘 Bad Roads Registration Succesful',
    html: '<p>Thankyou for registering with us! Now you can login to your account and Start uploading the bad roads!😎</p>'

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });

    req.flash('Success:-', 'You are now registered and can Login!',false);
    // res.redirect('/api/login');
    res.render('login',{x:1});

}
}


})

})


router
   .route('/login')
   .get(ctrlUsers.userLogin)




//,failureFlash:'Invalid Username or Password'

router.post('/login',
passport.authenticate('local',{failureRedirect:'/api/wronglogin'}),
function(req, res, next){
req.flash('Success:-', 'You are Logged in!',false);
 res.redirect('/api/');

});


passport.serializeUser(function(user, done) {
       return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      return done(err, user);
});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){

      if(err) {return done(err);}

      if(!user){
        console.log("No user found");
         return done(null,false,{message:'Unknown User!'});
        }

      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) {return done(err); }

        if(isMatch){
       console.log("User Found!")
              return done(null,user);
        }
          else {
              return done(null, false, {
                  message: "Invalid password"})

           //return done(null,false)
         }
         })
})

}));











//service routes
router
 .route('/asks/:askid/services')
 .get(ctrlServices.servicesGetAll)
 .post(ctrlServices.servicesAddOne)

router
 .route('/asks/:askid/services/:serviceid')
 .get(ctrlServices.servicesGetOne)
 .put(ctrlServices.servicesUpdateOne)
 .delete(ctrlServices.servicesDeleteOne)





router.post('/gpic',multer(multerConf).single('photo'),function(req, res){
  if(req.file){
    console.log(req.file);
    req.body.photo=req.file.filename;

}
const upload=new Ask(req.body).save();

 res
  .sendFile('thn.html', {root:'./views/'})

})
