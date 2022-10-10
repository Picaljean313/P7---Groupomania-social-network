const mongoose = require ('mongoose');

const userSchema = mongoose.Schema ({
  pseudo : { type : String, required : true },
  imageUrl : { type : String, required : true },
  theme : { type : String, required : true },
  email : { type : String, required : true, unique : true },
  password : { type : String, required : true },
  creationDate : { type : Date, default : Date.now, required : true },
  isAdmin : { type : Boolean, default : false, required : true }
});

module.exports = mongoose.model('Users', userSchema);