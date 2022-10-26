const CommentsModel = require ('../models/Comments');
const PostsModel = require ('../models/Posts');
const createOneComment = require('../validation/data/createOneComment');
const rules = require('../validation/rules');
const functions = require('../functions');

exports.createOneComment = async function (req, res, next) {
  const validCommentJson = rules.valid(createOneComment.commentJsonDataToValidate, req.body); 
  if(!validCommentJson) return functions.response(res, 400);

  let post;
  try {
    post = await PostsModel.findOne({ _id : req.body.postId });
  } catch {
    console.log("Can't find post.");
    return functions.response(res, 500);
  }
  if (post === null) return functions.response(res, 400);

  const commentCreated = new CommentsModel ({
    content : req.body.content,
    postId : req.body.postId,
    userId : req.auth.userId
  });
  try {
    await commentCreated.save()
  } catch {
    console.log("Can't save comment.");
    return functions.response(res, 500);
  }
  
  return res.status(201).json({ message : "Comment created." });
};

exports.getAllComments = (req, res, next) => {

};

exports.deleteAllComments = (req, res, next) => {

};

exports.getOneComment = (req, res, next) => {

};

exports.modifyOneComment = (req, res, next) => {

};

exports.deleteOneComment = (req, res, next) => {

};