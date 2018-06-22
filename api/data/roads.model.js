var mongoose = require('mongoose');

var roadSchema= new mongoose.Schema({

    description: {
      type: String
    },

      badpic:{
        type:String
    },
    lat:{
      type:String
  },
  lng:{
    type:String
}

  })

var Road=module.exports=mongoose.model('Road',roadSchema);
