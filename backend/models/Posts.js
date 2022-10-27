const mongoose = require ('mongoose');

const postSchema = new mongoose.Schema ({
  content : { type : String },
  imageUrl : { type : String },
  userId : { type : mongoose.Schema.Types.ObjectId, ref : "Users", required : true },
  creationDate : { type : Date, default : Date.now, required : true }
});

module.exports = mongoose.model('Posts', postSchema);