var mongoose = require('mongoose');

var storageSchema = new mongoose.Schema({
  FUP:{
    type:Number,
    required:true
  },
  Data:{
  type:Number,
  required:true
}
})


var supportSchema = new mongoose.Schema({
  Admin:{
    type:Number,
    required:true
  },
  Customer:{
  type:Number,
  required:true
}
})

var serviceSchema = new mongoose.Schema({
  Storage:[storageSchema],
  Support:[supportSchema],
  Time:Number
})


var askSchema= new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  theme: [String],
  genre: String,
  admincount: {
    type:Number,
    min:1,
    max:2,
    default:1
  },
  services:[serviceSchema],
  createdOn:{
    type: Date,
    "default":Date.now
  },

  photo: {
    data: Buffer, contentType: String
   }
  })


mongoose.model('Ask',askSchema,'asks');
