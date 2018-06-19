var mongoose = require('mongoose')
var Ask = mongoose.model('Ask')

//Get all services for a Ask
module.exports.servicesGetAll = function(req, res){
  var askid = req.params.askid;
  console.log("Get askID",askid);

 Ask
  .findById(askid)
  .select('services')
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
         console.log("Ask id not found in database", id);
         response.status = 404;
         response.message = {
           "message" : "Ask ID not found " + id
         };
       } else {
         response.message = doc.services ? doc.services : [];
       }
       res
         .status(response.status)
         .json(response.message);
     });
 };
//Get single service for a ask
module.exports.servicesGetOne = function(req,res){
  var askid = req.params.askid;
  var serviceid= req.params.serviceid;
  console.log("Get serviceid "+serviceid+" for askid "+askid)

  Ask
   .findById(askid)
   .select('services')
   .exec(function(err,ask){
     var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding ask");
        response.status = 500;
        response.message = err;
      } else if(!ask) {
        console.log("Ask id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Ask ID not found " + id
        };
      } else {
        // Get the review
        response.message = ask.services.id(serviceid);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Service ID not found " + serviceid
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

//Code for servicesAddOne
var _addService = function (req, res, ask) {

  ask.services.push({
    Storage : {
      FUP : parseInt(req.body.FUP,10),
      Data: parseInt(req.body.Data,10)
    },
    Support : {
      Admin: parseInt(req.body.Admin,10),
      Customer:parseInt(req.body.Customer,10)
    },
    Time:    parseInt(req.body.Time,10)
  });

  ask.save(function(err, askUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(200)
        .json(askUpdated.services[askUpdated.services.length - 1]);
    }
  });

};

module.exports.servicesAddOne = function(req, res) {

  var id = req.params.askid;

  console.log('POST review to askid', id);

  Ask
    .findById(id)
    .select('services')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding ask");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("askid not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Ask ID not found " + id
        };
      }
      if (doc) {
        _addService(req, res, doc);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
    });
};

//code for servicesUpdateOne
module.exports.servicesUpdateOne = function(req, res) {
  var askid = req.params.askid;
  var serviceid = req.params.serviceid;
  console.log('PUT serviceId ' + serviceid + ' for hotelId ' + askid);

  Ask
    .findById(askid)
    .select('services')
    .exec(function(err, hotel) {
      var thisService;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding ask");
        response.status = 500;
        response.message = err;
      } else if(!ask) {
        console.log("Ask id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Ask ID not found " + id
        };
      } else {
        // Get the review
        thisService = ask.services.id(serviced);
        // If the review doesn't exist Mongoose returns null
        if (!thisService) {
          response.status = 404;
          response.message = {
            "message" : "Service ID not found " + serviceid
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisService.Storage.FUP = parseInt(req.body.FUP,10);
        thisService.Storage.Data= parseInt(req.body.Data,10);
        thisService.Support.Admin= parseInt(req.body.Admin,10);
        thisService.Support.Customer=parseInt(req.body.Customer,10);
        thisService.Time = parseInt(req.body.Time,10);

        ask.save(function(err, askUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};

//Code for the servicesDeleteOne
module.exports.servicesDeleteOne = function(req, res) {
  var askid = req.params.askid;
  var serviceid = req.params.serviceid;
  console.log('Delete serviceId ' + serviceid + ' for askid ' + askid);

  Ask
    .findById(askid)
    .select('services')
    .exec(function(err, ask) {
      var thisService;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding ask");
        response.status = 500;
        response.message = err;
      } else if(!ask) {
        console.log("Ask id not found in database", askid);
        response.status = 404;
        response.message = {
          "message" : "Ask ID not found " + askid
        };
      } else {
        // Get the review
        thisService = ask.services.id(serviceid);
        // If the review doesn't exist Mongoose returns null
        if (!thisService) {
          response.status = 404;
          response.message = {
            "message" : "Service ID not found " + serviceid
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        ask.services.id(serviceid).remove();
        ask.save(function(err, askUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};
