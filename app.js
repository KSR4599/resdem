//Requiring and importing all the needsy
require('./api/data/db.js');
var express = require('express')
var favicon = require('serve-favicon');
var app = express()
var expressValidator = require('express-validator');
var path= require('path')
var bodyParser= require('body-parser')
var routes = require('./api/routes')
var hbs = require('express-handlebars')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var multer = require('multer')
var flash = require('express-flash-notification');
var bcrypt=require('bcryptjs')
var asy = require("async");
var mongo = require('mongodb')
var mongoose = require('mongoose')
const nodemailer = require('nodemailer')
var Razorpay = require('razorpay');




//the middleware use() function of express for serving static files.
app.use(express.static(path.join(__dirname,'views')))
app.get('/', function(req, res){
  res.render('index');

});

//cookieParser
app.use(cookieParser());


//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new MongoStore({url: 'mongodb://localhost:27017/asksdata'}),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000  }
}))

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

//flash
//express-messages
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(flash(app));

//middle function to log some details..
app.use(function(req, res,next){
  res.locals.messages=require('express-messages')(req,res);
  console.log(req.method, req.url)
  next();
})

app.get('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();
})

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg   : msg,
        value : value
    };
  }
  }));


//setting the port
app.set('port',3000)



//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//temp engine
app.engine('hbs',hbs({extname:'hbs',defaultLayout: 'layout1', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','hbs');






//bodyparser for posting the form related Data
app.use(bodyParser.urlencoded({ extended : false}))

//if a request starting with /api occurs it searches automatically in the routes folder.
app.use('/api',routes)

//making use of variable to configure the server properties..
var server = app.listen(app.get('port'),function(){
  var port = server.address().port;
  console.log('Express server listening on port ' + port)
})
