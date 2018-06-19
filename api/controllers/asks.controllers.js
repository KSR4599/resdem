var mongoose = require('mongoose')
var Ask= mongoose.model('Ask')
var fs= require("fs")
const multer = require('multer');
var upload = multer({dest: '../resdem/views/images/mainpics'})



module.exports.asksGetAll = function(req, res){

  var offset=0;
  var count=5;
  var maxCount=6;

  if (req.query && req.query.offset){
    offset = parseInt(req.query.offset, 10)
  }

  if (req.query && req.query.count){
    count = parseInt(req.query.count, 10)
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  Ask
   .find()
   .skip(offset)
   .limit(count)
   .exec(function(err,asks){
     console.log(err)
     console.log(asks)
     if(err){
       console.log("Error Finding the asks")
       res
        .status(500)
        .josn(err)
     }else{

     console.log("FOund Asks", asks.length)
     res
      .json(asks)
    }
   })
}



module.exports.asksGetOne = function(req, res){

var askid=req.query.askid;
console.log("Get the Ask", askid);

Ask
 .findById(askid)
 .exec(function(err, doc){
   var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding ask");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("AskId not found in database", askid);
        response.status = 404;
        response.message = {
          "message" : "Ask ID not found " + askid
        };
      }
      res
        .status(response.status)
        .render('index',{doc});
    });

};

//split array method for array of string data types.
var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.asksAddOne = function(req, res){
 console.log("POST new ask")

 Ask
   .create({
     name : req.body.name,
     theme : _splitArray(req.body.theme),
     genre :req.body.genre,
     admincount : parseInt(req.body.admincount,10)
   }, function(err, ask) {
     if (err) {
       console.log("Error creating ask");
       res
         .status(400)
         .json(err);
     } else {
       console.log("New Ask created!", ask);
       res
         .status(201)
         .sendFile('pic.html', {root:'./views/'})
     }
   });

};

//Code for asksUpdateOne
module.exports.asksUpdateOne = function(req, res) {
  var askid = req.params.askid;

  console.log('GET askid', askid);

  Ask
    .findById(askid)
    .select('-services')
    .exec(function(err, ask) {
      if (err) {
        console.log("Error finding ask");
        res
          .status(500)
          .json(err);
          return;
      } else if(!ask) {
        console.log("Askid not found in database", askid);
        res
          .status(404)
          .lson({
            "message" : "Ask ID not found " + askid
          });
          return;
      }

      ask.name = req.body.name;
      ask.theme = _splitArray(req.body.theme);
      ask.genre =req.body.genre;
      ask.admincount = parseInt(req.body.admincount,10);

      ask
        .save(function(err, askUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });


    });

};


//Code for Asks Delete One.
module.exports.asksDeleteOne = function(req, res) {
  var askid = req.params.askid;

  Ask
    .findByIdAndRemove(askid)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("Ask deleted, id:", askid);
        res
          .status(204)
          .json();
      }
    });
};

module.exports.askPic = function(req, res) {
  var picname = req.query.picname;
  console.log(picname);
    res
     .render('gpic',{pic:picname});
 }

 module.exports.askName = function(req, res) {
   var askname = req.query.askname;
   console.log("Got the ask for"+askname);

    Ask
     .findOne({name: askname}, function(err,doc) {
      if(!doc){
        res
         .render('err',{err:'No such data exists in our base!'})
      }
      else{
      console.log(doc);
      res
       .render('index',{doc});
}
    })
  }
