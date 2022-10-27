const ReportsModel = require ('../models/Reports');
const UsersModel = require ('../models/Users');
const PostsModel = require ('../models/Posts');
const CommentsModel = require ('../models/Comments');
const reqQueries = require('../validation/data/reqQueries');
const createOneReport = require ('../validation/data/createOneReport');
const rules = require('../validation/rules');
const functions = require('../functions');
const id = require('../validation/data/id');
const url = require ('url');

exports.createOneReport = async function (req, res, next) {
  const validReportJson = rules.valid(createOneReport.reportJsonDataToValidate, req.body); 
  if(!validReportJson) return functions.response(res, 400);

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

    let report;
    try {
      report = await ReportsModel.findOne({ userId : req.auth.userId, postId : post._id });
    } catch {
      console.log("Can't find report.");
      return functions.response(res, 500);
    }
    if (report !== null) return functions.response(res, 400);
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

    let report;
    try {
      report = await ReportsModel.findOne({ userId : req.auth.userId, commentId : comment._id });
    } catch {
      console.log("Can't find report.");
      return functions.response(res, 500);
    }
    if (report !== null) return functions.response(res, 400);
  }

  const reportCreated = new ReportsModel ({
    postId : req.body.postId,
    commentId : req.body.commentId,
    userId : req.auth.userId
  });
  try {
    await reportCreated.save()
  } catch {
    console.log("Can't save report.");
    return functions.response(res, 500);
  }
  
  return res.status(201).json({ message : "report created." });
};

exports.getAllReports = (req, res, next) => {

};

exports.deleteAllReports = (req, res, next) => {

};

exports.getOneReport = (req, res, next) => {

};

exports.deleteOneReport = (req, res, next) => {

};