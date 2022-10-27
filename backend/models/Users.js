const mongoose = require ('mongoose');
const variables = require ('../variables');

const userSchema = new mongoose.Schema ({
  pseudo : { type : String, required : true },
  imageUrl : { type : String, default : variables.defaultImageUrl, required : true },
  theme : { type : String, default : variables.defaultTheme, required : true },
  email : { type : String, required : true, unique : true },
  password : { type : String, required : true },
  creationDate : { type : Date, default : Date.now, required : true },
  isAdmin : { type : Boolean, default : false, required : true }
});

module.exports = mongoose.model('Users', userSchema);