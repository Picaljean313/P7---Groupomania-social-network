const ReactionsModel = require ('../models/Reactions');
const PostsModel = require ('../models/Posts');
const CommentsModel = require ('../models/Comments');
const createOneReaction = require ('../validation/data/createOneReaction');
const rules = require('../validation/rules');
const functions = require('../functions');

exports.createOneReaction = async function (req, res, next) {
  const validReactionJson = rules.valid(createOneReaction.reactionJsonDataToValidate, req.body); 
  if(!validReactionJson) return functions.response(res, 400);

  const isCommentId = req.body.commentId ? true : false;
  const isPostId = req.body.postId ? true : false;

  if ((isCommentId && isPostId) || (!isCommentId && !isPostId)) return functions.response(res, 400);

  if (isPostId) {
    let post;
    try {
      post = await PostsModel.findOne({ _id : req.body.postId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    let reaction;
    try {
      reaction = await ReactionsModel.findOne({ userId : req.auth.userId, postId : post._id });
    } catch {
      console.log("Can't find reaction.");
      return functions.response(res, 500);
    }
    if (reaction !== null) return functions.response(res, 400);
  }

  if (isCommentId) {
    let comment;
    try {
      comment = await CommentsModel.findOne({ _id : req.body.commentId });
    } catch {
      console.log("Can't find comment.");
      return functions.response(res, 500);
    }
    if (comment === null) return functions.response(res, 400);

    let reaction;
    try {
      reaction = await ReactionsModel.findOne({ userId : req.auth.userId, commentId : comment._id });
    } catch {
      console.log("Can't find reaction.");
      return functions.response(res, 500);
    }
    if (reaction !== null) return functions.response(res, 400);
  }

  const reactionCreated = new ReactionsModel ({
    type : req.body.type,
    postId : req.body.postId,
    commentId : req.body.commentId,
    userId : req.auth.userId
  });
  try {
    await reactionCreated.save()
  } catch {
    console.log("Can't save reaction.");
    return functions.response(res, 500);
  }
  
  return res.status(201).json({ message : "Reaction created." });
};

exports.getAllReactions = (req, res, next) => {

};

exports.deleteAllReactions = (req, res, next) => {

};

exports.getOneReaction = (req, res, next) => {

};

exports.modifyOneReaction = (req, res, next) => {

};

exports.deleteOneReaction = (req, res, next) => {

};