const mongoose = require ('mongoose');

const userSchema = mongoose.Schema ({
  pseudo : { type : String, required : true },
  imageUrl : { type : String, default : "http://localhost:3000/images/Donald.png1665064469847.png", required : true },
  theme : { type : String, default : "Original", required : true },
  email : { type : String, required : true, unique : true },
  password : { type : String, required : true },
  creationDate : { type : Date, default : Date.now, required : true },
  isAdmin : { type : Boolean, default : false, required : true }
});

module.exports = mongoose.model('Users', userSchema);