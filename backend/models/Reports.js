const mongoose = require ('mongoose');

const reportSchema = new mongoose.Schema ({
  postId : { type : mongoose.Schema.Types.ObjectId, ref : "Posts", required : function (){ return !this.commentId }},
  commentId : { type : mongoose.Schema.Types.ObjectId, ref : "Comments"},
  userId : { type : mongoose.Schema.Types.ObjectId, ref : "Users", required : true },
  creationDate : { type : Date, default : Date.now, required : true }
});

module.exports = mongoose.model('Reports', reportSchema);