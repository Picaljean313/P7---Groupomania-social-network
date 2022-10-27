const mongoose = require ('mongoose');

const commentSchema = new mongoose.Schema ({
  content : { type : String, required : true },
  postId : { type : mongoose.Schema.Types.ObjectId, ref : "Posts", required : true },
  userId : { type : mongoose.Schema.Types.ObjectId, ref : "Users", required : true },
  creationDate : { type : Date, default : Date.now, required : true }
});

module.exports = mongoose.model('Comments', commentSchema);