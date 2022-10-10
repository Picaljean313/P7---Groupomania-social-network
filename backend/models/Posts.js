const mongoose = require ('mongoose');

const postSchema = mongoose.Schema ({
  content : { type : String, required : function () { return this.imageUrl === null }},
  imageUrl : { type : String },
  userId : { type : mongoose.Schema.Types.ObjectId, ref : "Users", required : true },
  creationDate : { type : Date, default : Date.now, required : true }
});

module.exports = mongoose.model('Posts', postSchema);