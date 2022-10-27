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

exports.getAllReports = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "fromUserId", "fromPostId", "fromCommentId"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  const invalidReqQueries = reqQueriesKeys.map(x => allowedQueries.includes(x)).includes(false);
  if (invalidReqQueries) return functions.response(res, 400);

  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  if (!validParams) return functions.response(res, 400);

  const minDate = req.query.minDate ? Date.parse(req.query.minDate) : 0;
  const maxDate = req.query.maxDate ? Date.parse(req.query.maxDate) : Date.now();
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const sort = req.query.sort ? req.query.sort : null;
  const fromUserId = req.query.fromUserId;
  const fromPostId = req.query.fromPostId;
  const fromCommentId = req.query.fromCommentId;
  const searchParam = {};

  if (fromPostId && fromCommentId) return functions.response(res, 400);

  if (fromUserId) {
    let user;
    try {
      user = await UsersModel.findOne({ _id : fromUserId });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    searchParam.userId = fromUserId;
  }

  if (fromPostId) {
    let post;
    try {
      post = await PostsModel.findOne({ _id : fromPostId });
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    searchParam.postId = fromPostId;
  }

  if (fromCommentId) {
    let comment;
    try {
      comment = await CommentsModel.findOne({ _id : fromCommentId });
    } catch {
      console.log("Can't find comment.");
      return functions.response(res, 500);
    }
    if (comment === null) return functions.response(res, 400);

    searchParam.commentId = fromCommentId;
  }

  let reports;
  try {
    reports = await ReportsModel.find(searchParam).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
  } catch {
    console.log("Can't find reports.");
    return functions.response(res, 500);
  } 

  return res.status(200).json(reports);
};

exports.deleteAllReports = (req, res, next) => {

};

exports.getOneReport = (req, res, next) => {

};

exports.deleteOneReport = (req, res, next) => {

};