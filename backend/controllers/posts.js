const PostsModel = require ('../models/Posts');
const UsersModel = require ('../models/Users');
const CommentsModel = require('../models/Comments');
const ReactionsModel = require('../models/Reactions');
const ReportsModel = require ('../models/Reports');
const createOnePost = require ('../validation/data/createOnePost');
const modifyOnePost = require ('../validation/data/modifyOnePost');
const rules = require('../validation/rules');
const functions = require('../functions');
const reqQueries = require('../validation/data/reqQueries');
const variables = require('../variables');
const id = require('../validation/data/id');
const url = require ('url');
const fs = require ('fs');

exports.createOnePost = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedPostBody = req.body.post ? true : false;
    if (includedPostBody) {
      const validPostFormData = rules.valid(createOnePost.postFormDataToValidate, req.body.post);
      if (!validPostFormData) return functions.unlinkFile(req, res, 400);

      const validPostJson = rules.valid(createOnePost.postJsonDataToValidate, JSON.parse(req.body.post)); 
      if (!validPostJson) return functions.unlinkFile(req, res, 400);

      const postCreated = new PostsModel ({
        content : JSON.parse(req.body.post).content,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId : req.auth.userId
      });
      try {
        await postCreated.save()
      } catch {
        console.log("Can't save post.");
        return functions.unlinkFile(req, res, 500);
      }

      return res.status(201).json({ message : "Post created." });
    } 
    else {
      const postCreated = new PostsModel ({
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId : req.auth.userId
      });
      try {
        await postCreated.save()
      } catch {
        console.log("Can't save post.");
        return functions.unlinkFile(req, res, 500);
      }
      
      return res.status(201).json({ message : "Post created." });
    }
  } else {
    const validPostJson = rules.valid(createOnePost.postJsonDataToValidate, req.body); 
    if(!validPostJson) return functions.response(res, 400);

    const postCreated = new PostsModel ({
      content : req.body.content,
      userId : req.auth.userId
    });
    try {
      await postCreated.save()
    } catch {
      console.log("Can't save post.");
      return functions.response(res, 500);
    }
    
    return res.status(201).json({ message : "Post created." });
  }
};

exports.getAllPosts = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "fromUserId", "reactions", "comments", "commentsReactions", "userData", "commentsUserData"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  const invalidReqQueries = reqQueriesKeys.map(x => allowedQueries.includes(x)).includes(false);
  if (invalidReqQueries) return functions.response(res, 400);

  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  if (!validParams) return functions.response(res, 400);

  if (req.query.commentsReactions === "true" && req.query.comments !== "true") return functions.response(res, 400);
  if (req.query.commentsUserData === "true" && req.query.comments !== "true") return functions.response(res, 400);

  const minDate = req.query.minDate ? Date.parse(req.query.minDate) : 0;
  const maxDate = req.query.maxDate ? Date.parse(req.query.maxDate) : Date.now();
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const sort = req.query.sort ? req.query.sort : null;
  const fromUserId = req.query.fromUserId;
  let posts;

  if (fromUserId){
    let user;
    try {
      user = await UsersModel.findOne({ _id : fromUserId });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    try {
      posts = await PostsModel.find({ userId : fromUserId }).sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find posts.");
      return functions.response(res, 500);
    }
  } 
  else {
    try {
      posts = await PostsModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
    } catch {
      console.log("Can't find posts.");
      return functions.response(res, 500);
    }  
  }

  if (req.query.userData === "true"){
    let results;
    try {
      const promises = [];
      for (let i in posts) {
        const promise = UsersModel.findOne({ _id : posts[i].userId }).lean();
        promises.push(promise);
      }
      results = await Promise.all(promises);
    } catch {
      console.log("Can't find all posts reactions.");
      return functions.response(res, 500);
    }

    for (let i in posts) {
      posts[i]["userData"] = results[i];
    }
  }

  if (req.query.reactions === "true"){
    let results;
    try {
      const promises = [];
      for (let i in posts) {
        const promise = ReactionsModel.find({ postId : posts[i]._id }).lean();
        promises.push(promise);
      }
      results = await Promise.all(promises);
    } catch {
      console.log("Can't find all posts reactions.");
      return functions.response(res, 500);
    }

    for (let i in posts) {
      posts[i]["reactions"] = results[i];
    }
  }

  if (req.query.comments === "true"){
    let results;
    try {
      const promises = [];
      for (let i in posts) {
        const promise = CommentsModel.find({ postId : posts[i]._id }).sort({creationDate : "desc"}).lean();
        promises.push(promise);
      }
      results = await Promise.all(promises);
    } catch {
      console.log("Can't find all posts comments.");
      return functions.response(res, 500);
    }
    
    for (let i in posts) {
      posts[i]["comments"] = results[i];
    }

    if (req.query.commentsUserData === "true") {
      let results;
      try {
        const promises = [];
        for (let i in posts) {
          for (let j in posts[i]["comments"]) {
            const promise = UsersModel.findOne({ _id : posts[i]["comments"][j].userId }).lean();
            promises.push(promise);
          }
        }
        results = await Promise.all(promises);
      } catch {
        console.log("Can't find all comments user data.");
        return functions.response(res, 500);
      }
 
      let k = 0;
      for (let i in posts) {
        for (let j in posts[i]["comments"]) {
          posts[i]["comments"][j].userData = results[k];
          k++;
        }
      }
    }

    if (req.query.commentsReactions === "true") {
      let results;
      try {
        const promises = [];
        for (let i in posts) {
          for (let j in posts[i]["comments"]) {
            const promise = ReactionsModel.find({ commentId : posts[i]["comments"][j]._id }).lean();
            promises.push(promise);
          }
        }
        results = await Promise.all(promises);
      } catch {
        console.log("Can't find all comments reactions.");
        return functions.response(res, 500);
      }
 
      let k = 0;
      for (let i in posts) {
        for (let j in posts[i]["comments"]) {
          posts[i]["comments"][j].reactions = results[k];
          k++;
        }
      }
    }
  }

  return res.status(200).json(posts);
};

exports.deleteAllPosts = async function (req, res, next) {
  const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
  let posts;
  try {
    posts = await PostsModel.find()
  } catch {
    console.log("Can't find posts.");
    return functions.response(res, 500);
  }
  const postsImagesToDelete = [];
  for (let post of posts){
    if (typeof post.imageUrl === "string") {
      const postImage = post.imageUrl.split('images/')[1];
      if (postImage !== defaultImageToKeep) {
        postsImagesToDelete.push(postImage);
      }
    }
  };

  let failedPromises = 0;
  const deletedReactions = ReactionsModel.deleteMany()
    .catch(() => {
      console.log("Can't delete reactions");
      failedPromises++;
    });
  const deletedReports = ReportsModel.deleteMany()
  .catch(() => {
    console.log("Can't delete reports");
    failedPromises++;
  });
  await Promise.allSettled([deletedReactions, deletedReports]);
  if (failedPromises !== 0) return functions.response(res, 500);

  try {
    await CommentsModel.deleteMany();
  } catch {
    console.log("Can't delete comments.");
    return functions.response(res, 500);
  }

  try {
    await PostsModel.deleteMany();
  } catch {
    console.log("Can't delete posts.");
    return functions.response(res, 500);
  }

  const promises = [];
  for (let image of postsImagesToDelete) {
    const promise = fs.promises.unlink(`images/${image}`)
      .catch(() => console.log(`Can't delete ${image}.`));
    promises.push(promise);
  }
  await Promise.allSettled(promises);

  return functions.response(res,200);
};

exports.getOnePost = async function (req, res, next) {
  const allowedQueries = ["reactions", "comments", "commentsReactions", "userData", "commentsUserData"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  const invalidReqQueries = reqQueriesKeys.map(x => allowedQueries.includes(x)).includes(false);
  if (invalidReqQueries) return functions.response(res, 400);

  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  const invalidPostId = !rules.valid(id.idToValidate, req.params.postId);
  if (!validParams || invalidPostId) return functions.response(res, 400);

  if (req.query.commentsReactions === "true" && req.query.comments !== "true") return functions.response(res, 400);
  if (req.query.commentsUserData === "true" && req.query.comments !== "true") return functions.response(res, 400);

  let post;
  try {
    post = await PostsModel.findOne({ _id : req.params.postId }).lean();
  } catch {
    console.log("Can't find post.");
    return functions.response(res, 500);
  }
  if (post === null) return functions.response(res, 400);

  if (req.query.userData === "true"){
    let result;
    try {
      result = await UsersModel.findOne({ _id : post.userId }).lean();
    } catch {
      console.log("Can't find post user.");
      return functions.response(res, 500);
    }
    post["userData"] = result;
  }

  if (req.query.reactions === "true"){
    let reactions;
    try {
      reactions = await ReactionsModel.find({ postId : post._id }).lean();
    } catch {
      console.log("Can't find reactions.");
      return functions.response(res, 500);
    }
    post["reactions"] = reactions;
  }

  if (req.query.comments === "true"){
    let comments;
    try {
      comments = await CommentsModel.find({ postId : post._id }).sort({creationDate : "desc"}).lean();
    } catch {
      console.log("Can't find comments.");
      return functions.response(res, 500);
    }
    post["comments"] = comments;

    if (req.query.commentsUserData === "true") {
      let results;
      try {
        const promises = [];
        for (let i in post["comments"]) {
          const promise = UsersModel.findOne({ _id : post["comments"][i].userId }).lean();
          promises.push(promise);
        }
        results = await Promise.all(promises);
      } catch {
        console.log("Can't find all comments user data.");
        return functions.response(res, 500);
      }
 
      let j = 0;
      for (let i in post["comments"]) {
        post["comments"][i].userData = results[j];
        j++;
      }
    }

    if (req.query.commentsReactions === "true") {
      let results;
      try {
        const promises = [];
        for (let i in post["comments"]) {
          const promise = ReactionsModel.find({ commentId : post["comments"][i]._id }).lean();
          promises.push(promise);
        }
        results = await Promise.all(promises);
      } catch {
        console.log("Can't find all comments reactions.");
        return functions.response(res, 500);
      }
 
      for (let i in post["comments"]) {
        post["comments"][i].reactions = results[i];
      }
    }
  }

  return res.status(200).json(post);
};

exports.modifyOnePost = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile){
    const invalidPostId = !rules.valid(id.idToValidate, req.params.postId);
    if (invalidPostId) return functions.unlinkFile(req, res, 400);

    let post;
    try {
      if (!req.auth.isAdmin){
        post = await PostsModel.findOne({ _id : req.params.postId, userId : req.auth.userId }).lean();
      }
      else {
        post = await PostsModel.findOne({ _id : req.params.postId }).lean();
      }
    } catch {
      console.log("Can't find post.");
      return functions.unlinkFile(req, res, 500);
    }
    if (post === null) return functions.unlinkFile(req, res, 400);

    if (req.body.post){
      const validPostFormData = rules.valid(modifyOnePost.postFormDataToValidate, req.body.post);
      if (!validPostFormData) return functions.unlinkFile(req, res, 400);

      const validPostJson = rules.valid(modifyOnePost.postJsonDataToValidate, JSON.parse(req.body.post));
      if (!validPostJson) return functions.unlinkFile(req, res, 400);

      const isContent = JSON.parse(req.body.post).content !== undefined;
      const isDeletePostContent = JSON.parse(req.body.post).deletePostContent === true;
      if (isContent && isDeletePostContent) return functions.unlinkFile(req, res, 400);

      if (!isContent && !isDeletePostContent) return functions.unlinkFile(req, res, 400);

      if (isDeletePostContent && post.content === undefined) return functions.unlinkFile(req, res, 400);

      if (isContent){
        if (JSON.parse(req.body.post).content !== post.content){
          post.content = JSON.parse(req.body.post).content;
        } 
      };

      if (isDeletePostContent){
        delete post.content;
        try {
          await PostsModel.updateOne({ _id : req.params.postId }, {$unset: {content: 1 }});
        } catch {
          console.log("Can't remove content field.");
          return functions.unlinkFile(req, res, 500);
        }
      }
    } 

    let imageToDelete = undefined;
    const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
    if (typeof post.imageUrl === "string"){
      if (post.imageUrl.split('images/')[1] !== defaultImageToKeep){
        imageToDelete = post.imageUrl.split('images/')[1]; 
      };
    };

    post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    try {
      await PostsModel.updateOne({ _id : req.params.postId }, post);
    } catch {
      console.log("Can't update user.");
      return functions.unlinkFile(req, res, 500);
    }

    if (imageToDelete !== undefined) {
      await fs.promises.unlink(`images/${imageToDelete}`)
        .catch(()=> console.log(`Can't delete ${imageToDelete}.`));
    }

    let postUpdated;
    try {
      postUpdated = await PostsModel.findOne({ _id : req.params.postId });
    } catch {
      console.log("Can't get user updated.");
    }

    return res.status(200).json(postUpdated);
  } 
  else {
    const invalidPostId = !rules.valid(id.idToValidate, req.params.postId);
    if (invalidPostId) return functions.response(res, 400);

    let post;
    try {
      if (!req.auth.isAdmin){
        post = await PostsModel.findOne({ _id : req.params.postId, userId : req.auth.userId }).lean();
      }
      else {
        post = await PostsModel.findOne({ _id : req.params.postId }).lean();
      }
    } catch {
      console.log("Can't find post.");
      return functions.response(res, 500);
    }
    if (post === null) return functions.response(res, 400);

    const validPostJson = rules.valid(modifyOnePost.postJsonDataToValidate, req.body);
    if (!validPostJson) return functions.response(res, 400);

    const isContent = req.body.content !== undefined;
    const isDeletePostImage = req.body.deletePostImage === true;
    const isDeletePostContent = req.body.deletePostContent === true;
    const isPostImage = post.imageUrl !== undefined;
    const isPostContent = post.content !== undefined; 
    if (isContent && isDeletePostContent) return functions.response(res, 400);

    if (isDeletePostContent && isDeletePostImage) return functions.response(res, 400);

    if (!isContent && !isDeletePostContent && !isDeletePostImage) return functions.response(res, 400);

    if (isPostContent && !isPostImage){
      if (isDeletePostContent || isDeletePostImage) return functions.response(res, 400);
    }

    if (!isPostContent && isPostImage){
      if (isDeletePostContent) return functions.response(res, 400);
      if (!isContent && isDeletePostImage) return functions.response(res, 400);
    }

    if (isContent && req.body.content === post.content) return functions.response(res, 400);

    if (isContent){
      try {
        await PostsModel.updateOne({ _id : req.params.postId }, { content : req.body.content });
      } catch {
        console.log("Can't update post.");
        return functions.response(res, 500);
      }
    }

    if (isDeletePostContent){
      try {
        await PostsModel.updateOne({ _id : req.params.postId }, {$unset: {content: 1 }});
      } catch {
        console.log("Can't remove content field.");
        return functions.response(res, 500);
      }
    }

    if (isDeletePostImage){
      try {
        await PostsModel.updateOne({ _id : req.params.postId }, {$unset: {imageUrl: 1 }});
      } catch {
        console.log("Can't remove imageUrl field.");
        return functions.response(res, 500);
      }

      const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
      if (typeof post.imageUrl === "string") {
        const imageToDelete = post.imageUrl.split('images/')[1];
        if (imageToDelete !== defaultImageToKeep){
          await fs.promises.unlink(`images/${imageToDelete}`)
            .catch(() => console.log(`Can't delete ${imageToDelete}.`));
        }
      }
    };
    
    return functions.response(res,200);
  }
};

exports.deleteOnePost = async function (req, res, next) {
  const invalidPostId = !rules.valid(id.idToValidate, req.params.postId);
  if (invalidPostId) return functions.response(res, 400);

  let post;
  try {
    if (!req.auth.isAdmin){
      post = await PostsModel.findOne({ _id : req.params.postId, userId : req.auth.userId }).lean();
    }
    else {
      post = await PostsModel.findOne({ _id : req.params.postId }).lean();
    }
  } catch {
    console.log("Can't find post.");
    return functions.response(res, 500);
  }
  if (post === null) return functions.response(res, 400);

  const commentsIds = [];

  let comments;
  try {
    comments = await CommentsModel.find({ postId : req.params.postId });
  } catch {
    console.log("Can't find comments.");
    return functions.response(res, 500);
  }
  for (let comment of comments) {
    commentsIds.push(comment._id);
  }

  let failedPromises = 0;
  const deletedReactions = ReactionsModel.deleteMany({$or : [{ postId : req.params.postId }, { commentId : { $in : commentsIds }}] })
    .catch(() => {
      console.log("Can't delete reactions");
      failedPromises++;
    });
  const deletedReports = ReportsModel.deleteMany({$or : [{ postId : req.params.postId }, { commentId : { $in : commentsIds }}] })
  .catch(() => {
    console.log("Can't delete reports");
    failedPromises++;
  });
  await Promise.allSettled([deletedReactions, deletedReports]);
  if (failedPromises !== 0) return functions.response(res, 500);

  try {
    await CommentsModel.deleteMany({ postId : req.params.postId });
  } catch {
    console.log("Can't delete comments.");
    return functions.response(res, 500);
  }

  try {
    await PostsModel.deleteOne({ _id : req.params.postId });
  } catch {
    console.log("Can't delete post.");
    return functions.response(res, 500);
  }

  if (typeof post.imageUrl === "string") {
    const postImageToDelete = post.imageUrl.split('images/')[1];
    const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
    if (postImageToDelete !== defaultImageToKeep) {
      await fs.promises.unlink(`images/${postImageToDelete}`)
        .catch(() => console.log(`Can't delete ${postImageToDelete}.`));
    }
  }

  return functions.response(res, 200);
};