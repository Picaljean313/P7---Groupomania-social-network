const mongoose = require ('mongoose');

const reactionSchema = mongoose.Schema ({
  type : { type : Number, required : true },
  postId : { type : mongoose.Schema.Types.ObjectId, ref : "Posts", required : function (){ return this.commentId === null }},
  commentId : { type : mongoose.Schema.Types.ObjectId, ref : "Comments"},
  userId : { type : mongoose.Schema.Types.ObjectId, ref : "Users", required : true }
});

module.exports = mongoose.model('Reactions', reactionSchema);