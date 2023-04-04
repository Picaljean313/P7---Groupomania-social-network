const UsersModel = require ('../models/Users');
const PostsModel = require ('../models/Posts');
const CommentsModel = require ('../models/Comments');
const ReactionsModel = require ('../models/Reactions');
const ReportsModel = require ('../models/Reports');
const TokensModel = require ('../models/Tokens');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const functions = require ('../functions');
const variables = require ('../variables');
const rules = require ('../validation/rules');
const login = require ('../validation/data/login');
const signup = require ('../validation/data/signup');
const createOneUser = require('../validation/data/createOneUser');
const modifyOneUser = require('../validation/data/modifyOneUser');
const reqQueries = require('../validation/data/reqQueries');
const id = require ('../validation/data/id');
const url = require ('url');
const fs = require ('fs');

exports.signup = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);

    const validUserFormData = rules.valid(signup.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);

    const validUserJson = rules.valid(signup.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);

    const userObject = JSON.parse(req.body.user);
    let user;
    try {
      user = await UsersModel.findOne({ email: userObject.email });
    } catch {
      console.log("Can't find user.");
      return functions.unlinkFile(req, res, 500);
    }
    if (user !== null) return functions.unlinkFile(req, res, 400);

    let hash;
    try {
      hash = await bcrypt.hash(userObject.password, 10);
    } catch {
      console.log("Can't hash password.");
      return functions.unlinkFile(req, res, 500);
    }

    const userCreated = new UsersModel({
      pseudo : userObject.pseudo,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      theme : userObject.theme,
      email : userObject.email,
      password : hash
    });
    try {
      await userCreated.save();
    } catch {
      console.log("Can't save user.");
      return functions.unlinkFile(req, res, 500);
    }
    
    return res.status(201).json({ message : "Account created." });
  } 
  else {
    const validUserJson = rules.valid(signup.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);

    let user;
    try {
      user = await UsersModel.findOne({ email: req.body.email });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user !== null) return functions.response(res, 400);

    let hash;
    try {
      hash = await bcrypt.hash(req.body.password, 10);
    } catch {
      console.log("Can't hash password.");
      return functions.response(res, 500);
    }
    
    const userCreated = new UsersModel({
      pseudo : req.body.pseudo,
      theme : req.body.theme,
      email : req.body.email,
      password : hash
    });
    try {
      await userCreated.save();
    } catch {
      console.log("Can't save user.");
      return functions.response(res, 500);
    }
    
    return res.status(201).json({ message : "Account created." });
  }
};

exports.login = async function (req, res, next) {
  const validLoginData = rules.valid(login.loginDataToValidate, req.body);
  if(!validLoginData) return functions.response(res, 400);

  let user;
  try {
    user = await UsersModel.findOne({ email: req.body.email })
  } catch {
    console.log("Can't find user.");
    return functions.response(res, 500);
  }
  if (user === null) return functions.response(res, 400);

  let valid;
  try {
    valid = await bcrypt.compare(req.body.password, user.password);
  } catch {
    console.log("Can't compare password.");
    return functions.response(res, 500);
  }
  if (!valid) return functions.response(res, 400); 

  const token = new TokensModel({
    token : jwt.sign(
      { 
        userId : user._id,
        isAdmin : user.isAdmin
      },
      'HARIBO_C_EST_BEAU_LA_VIE',
      { expiresIn: '24h' }
    )
  });
  try {
    await token.save();
  } catch {
    console.log("Can't save token.");
    return functions.response(res, 500);
  }

  return res.status(200).json({ token : token.token });
};

exports.logout = async function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    await TokensModel.deleteOne({ token : token });
  } catch {
    console.log("Can't delete token.")
    return functions.response(res, 500);
  }

  return functions.response(res, 200);
};

exports.createOneUser = async function (req, res, next) {
  const includedFile = req.file ? true : false;
  if (includedFile) {
    const includedUserBody = req.body.user ? true : false;
    if (!includedUserBody) return functions.unlinkFile(req, res, 400);

    const validUserFormData = rules.valid(createOneUser.userFormDataToValidate, req.body.user);
    if (!validUserFormData) return functions.unlinkFile(req, res, 400);

    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, JSON.parse(req.body.user)); 
    if (!validUserJson) return functions.unlinkFile(req, res, 400);

    const userObject = JSON.parse(req.body.user);
    let user;
    try {
      user = await UsersModel.findOne({ email: userObject.email });
    } catch {
      console.log("Can't find user.");
      return functions.unlinkFile(req, res, 500);
    }
    if (user !== null) return functions.unlinkFile(req, res, 400);

    let hash;
    try {
      hash = await bcrypt.hash(userObject.password, 10);
    } catch {
      console.log("Can't hash password.")
      return functions.unlinkFile(req, res, 500);
    }
    
    const userCreated = new UsersModel({
      pseudo : userObject.pseudo,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      theme : userObject.theme,
      email : userObject.email,
      password : hash,
      isAdmin : userObject.isAdmin
    });
    try {
      await userCreated.save();
    } catch {
      console.log("Can't save user.")
      return functions.unlinkFile(req, res, 500);
    }

    return res.status(201).json({ message : "Account created." });
  } 
  else {
    const validUserJson = rules.valid(createOneUser.userJsonDataToValidate, req.body); 
    if (!validUserJson) return functions.response(res, 400);

    let user;
    try {
      user = await UsersModel.findOne({ email: req.body.email });
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user !== null) return functions.response(res, 400);

    let hash;
    try {
      hash = await bcrypt.hash(req.body.password, 10);
    } catch {
      console.log("Can't hash password.")
      return functions.response(res, 500);
    }
    
    const userCreated = new UsersModel({
      pseudo : req.body.pseudo,
      theme : req.body.theme,
      email : req.body.email,
      password : hash,
      isAdmin : req.body.isAdmin
    });
    try {
      await userCreated.save();
    } catch {
      console.log("Can't save user.")
      return functions.response(res, 500);
    }
    
    return res.status(201).json({ message : "Account created." });
  }
};

exports.getAllUsers = async function (req, res, next) {
  const allowedQueries = ["minDate", "maxDate", "limit", "sort", "activity"]; 
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
  let users;
  try {
    users = await UsersModel.find().sort({creationDate : sort}).where("creationDate").gte(minDate).lte(maxDate).limit(limit).lean();
  } catch {
    console.log("Can't find users.");
    return functions.response(res, 500);
  }
  
  if (req.query.activity === "true"){
    for (let user of users){
      let activityArray;
      try {
        const postsCount = PostsModel.count({ userId : user._id });
        const commentsCount = CommentsModel.count({ userId : user._id });
        const reactionsCount = ReactionsModel.count({ userId : user._id });
        activityArray = await Promise.all([postsCount, commentsCount, reactionsCount]);
      } catch {
        console.log("Can't get activity counts.")
        return functions.response(res, 500);
      }
      const userActivity = {
        posts : activityArray[0],
        comments : activityArray[1],
        reactions : activityArray[2]
      };
      user["activity"] = userActivity;
    }
  }

  return res.status(200).json(users);
};

exports.deleteAllUsers = async function (req, res, next) {
  const userId = req.auth.userId;
  const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
  let users;
  try {
    users = await UsersModel.find({ _id : { '$ne' : userId }})
  } catch {
    console.log("Can't find users.");
    return functions.response(res, 500);
  }
  const usersImagesToDelete = [];
  for (let user of users){
    const userImage = user.imageUrl.split('images/')[1];
    if (userImage !== defaultImageToKeep) {
      usersImagesToDelete.push(userImage);
    }
  };

  let posts;
  try {
    posts = await PostsModel.find({ userId : { '$ne' : userId }});
  } catch {
    console.log("Can't find posts.");
    return functions.response(res, 500);
  }
  const postsImagesToDelete = [];
  for (let post of posts){
    if (typeof post.imageUrl === "string"){
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
    await PostsModel.deleteMany({ userId : { '$ne' : userId }});
  } catch {
    console.log("Can't delete posts.");
    return functions.response(res, 500);
  }

  const promises1 = [];
  for (let image of postsImagesToDelete) {
    const promise = fs.promises.unlink(`images/${image}`)
      .catch(() => console.log(`Can't delete ${image}.`));
    promises1.push(promise);
  }
  await Promise.allSettled(promises1);

  try {
    await UsersModel.deleteMany({ _id : { '$ne' : userId }});
  } catch {
    console.log("Can't delete users.");
    return functions.response(res, 500);
  }

  const promises2 = [];
  for (let image of usersImagesToDelete) {
    const promise = fs.promises.unlink(`images/${image}`)
      .catch(() => console.log(`Can't delete ${image}.`));
    promises2.push(promise);
  }
  await Promise.allSettled(promises2);

  return functions.response(res, 200);
};

exports.getOneUser = async function (req, res, next) {
  const allowedQueries = ["activity"]; 
  const reqQueriesObject = url.parse(req.url, true).query;
  const reqQueriesKeys = Object.keys(reqQueriesObject);
  const invalidReqQueries = reqQueriesKeys.map(x => allowedQueries.includes(x)).includes(false);
  if (invalidReqQueries) return functions.response(res, 400);
  
  const validParams = rules.valid(reqQueries.reqQueriesToValidate, reqQueriesObject);
  const invalidUserId = req.params.userId !== "me" ? !rules.valid(id.idToValidate, req.params.userId) : false;
  if (!validParams || invalidUserId) return functions.response(res, 400);

  let user;
  try {
    if (req.params.userId !== "me") {
      user = await UsersModel.findOne({ _id : req.params.userId }).lean();
    } else {
      user = await UsersModel.findOne({ _id : req.auth.userId }).lean();
    }
  } catch {
    console.log("Can't find user.");
    return functions.response(res, 500);
  }
  if (user === null) return functions.response(res, 400);

  if (req.query.activity === "true"){
    let activityArray;
    try {
      const postsCount = PostsModel.count({ userId : user._id });
      const commentsCount = CommentsModel.count({ userId : user._id });
      const reactionsCount = ReactionsModel.count({ userId : user._id });
      activityArray = await Promise.all([postsCount, commentsCount, reactionsCount]);
    } catch {
      console.log("Can't get activity counts.")
      return functions.response(res, 500);
    }
    const userActivity = {
      posts : activityArray[0],
      comments : activityArray[1],
      reactions : activityArray[2]
    };
    user["activity"] = userActivity;
  }

  return res.status(200).json(user);
};

exports.modifyOneUser = async function (req, res, next) {
  const allowedNoHashedProperties = ["pseudo", "theme", "email"];
  const includedFile = req.file ? true : false;
  if (includedFile){
    const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
    if (invalidUserId) return functions.unlinkFile(req, res, 400);

    let user;
    try {
      user = await UsersModel.findOne({ _id : req.params.userId }).lean();
    } catch {
      console.log("Can't find user.");
      return functions.unlinkFile(req, res, 500);
    }
    if (user === null) return functions.unlinkFile(req, res, 400);

    if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.unlinkFile(req, res, 401);

    if (req.body.user){
      const validUserFormData = rules.valid(modifyOneUser.userFormDataToValidate, req.body.user);
      if (!validUserFormData) return functions.unlinkFile(req, res, 400);

      const validUserJson = rules.valid(modifyOneUser.userJsonDataToValidate, JSON.parse(req.body.user));
      if (!validUserJson) return functions.unlinkFile(req, res, 400);

      const userReqBodyPropertiesToModify = Object.keys(JSON.parse(req.body.user)).filter(e => allowedNoHashedProperties.includes(e));
      if (userReqBodyPropertiesToModify.length !== 0){
        for (let property of userReqBodyPropertiesToModify) {
          user[property] = JSON.parse(req.body.user)[property];
        };
      }

      if (JSON.parse(req.body.user).password) {
        let hash;
        try {
          hash = await bcrypt.hash(JSON.parse(req.body.user).password, 10);
        } catch {
          console.log("Can't hash password.");
          return functions.unlinkFile(req, res, 500);
        }
        user.password = hash;
      };
      
      if (JSON.parse(req.body.user).isAdmin !== undefined && req.auth.isAdmin) {
        user.isAdmin = JSON.parse(req.body.user).isAdmin;
      }
    } 

    const imageToDelete = user.imageUrl.split('images/')[1];
    user.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    try {
      await UsersModel.updateOne({ _id : req.params.userId }, user);
    } catch {
      console.log("Can't update user.");
      return functions.unlinkFile(req, res, 500);
    }

    const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
    if (imageToDelete !== defaultImageToKeep) {
      await fs.promises.unlink(`images/${imageToDelete}`)
        .catch(() => console.log(`Can't delete ${imageToDelete}.`));
    }

    let userModified;
    try {
      userModified = await UsersModel.findOne({_id : req.params.userId});
    } catch {
      console.log("Can't send back user.");
    }

    return res.status(200).json(userModified);
  } 
  else {
    const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
    if (invalidUserId) return functions.response(res, 400);

    let user;
    try {
      user = await UsersModel.findOne({ _id : req.params.userId }).lean();
    } catch {
      console.log("Can't find user.");
      return functions.response(res, 500);
    }
    if (user === null) return functions.response(res, 400);

    if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.response(res, 401);

    const validUserJson = rules.valid(modifyOneUser.userJsonDataToValidate, req.body);
    if (!validUserJson) return functions.response(res, 400);

    const userReqBodyPropertiesToModify = Object.keys(req.body).filter(e => allowedNoHashedProperties.includes(e));
    const isAdminChange = req.body.isAdmin !== undefined && req.auth.isAdmin ? true : false;
    if(userReqBodyPropertiesToModify.length === 0 && !isAdminChange && !req.body.password) return functions.response(res, 400);

    for (let property of userReqBodyPropertiesToModify) {
      user[property] = req.body[property];
    };

    if (req.body.password) {
      let hash;
      try {
        hash = await bcrypt.hash(req.body.password, 10);
      } catch {
        console.log("Can't hash password.");
        return functions.response(res, 500);
      }
      user.password = hash;
    };

    if (isAdminChange) {
      user.isAdmin = req.body.isAdmin;
    }

    try {
      await UsersModel.updateOne({ _id : req.params.userId }, user);
    } catch {
      console.log("Can't upadte user.")
      return functions.response(res, 500);
    }

    let userModified;
    try {
      userModified = await UsersModel.findOne({_id : req.params.userId});
    } catch {
      console.log("Can't send back user.");
      return functions.unlinkFile(req, res, 500);
    }

    return res.status(200).json(userModified);
  }
};

exports.deleteOneUser = async function (req, res, next) {
  const invalidUserId = !rules.valid(id.idToValidate, req.params.userId);
  if (invalidUserId) return functions.response(res, 400);

  let user;
  try {
    user = await UsersModel.findOne({ _id : req.params.userId });
  } catch {
    console.log("Can't find user.");
    return functions.response(res, 500);
  }
  if (user === null) return functions.response(res, 400);

  if (!req.auth.isAdmin && req.auth.userId !== req.params.userId) return functions.response(res, 401);

  let posts;
  try {
    posts = await PostsModel.find({ userId : req.params.userId });
  } catch {
    console.log("Can't find posts.");
    return functions.response(res, 500);
  }

  const postsToDeleteIds = [];
  const postsImagesToDelete = [];
  const defaultImageToKeep = variables.defaultImageUrl.split('images/')[1];
  for (let post of posts){
    postsToDeleteIds.push(post._id);
    if (typeof post.imageUrl === "string"){
      const postImage = post.imageUrl.split('images/')[1];
      if (postImage !== defaultImageToKeep) {
        postsImagesToDelete.push(postImage);
      }
    }
  };

  const commentsToDeleteIds = [];

  let comments;
  try {
    comments = await CommentsModel.find({ userId : req.params.userId });
  } catch {
    console.log("Can't find comments.");
    return functions.response(res, 500);
  }
  for (let comment of comments) {
    commentsToDeleteIds.push(comment._id);
  }

  let otherUsersCommentsOnUserPosts;
  try {
    otherUsersCommentsOnUserPosts = await CommentsModel.find({ $and : [{ postId : { $in : postsToDeleteIds }}, { userId : { $ne : req.params.userId }}] });
  } catch {
    console.log("Can't find comments.");
    return functions.response(res, 500);
  }
  for (let comment of otherUsersCommentsOnUserPosts) {
    commentsToDeleteIds.push(comment._id);
  }

  let failedPromises = 0;
  const deletedReactions = ReactionsModel.deleteMany({ $or : [{ userId : req.params.userId }, { commentId : { $in : commentsToDeleteIds }}, { postId : { $in : postsToDeleteIds }}] })
    .catch(() => {
      console.log("Can't delete reactions");
      failedPromises++;
    });
  const deletedReports = ReportsModel.deleteMany({ $or : [{ userId : req.params.userId }, { commentId : { $in : commentsToDeleteIds }}, { postId : { $in : postsToDeleteIds }}] })
  .catch(() => {
    console.log("Can't delete reports");
    failedPromises++;
  });
  await Promise.allSettled([deletedReactions, deletedReports]);
  if (failedPromises !== 0) return functions.response(res, 500);

  try {
    await CommentsModel.deleteMany({ _id : { $in : commentsToDeleteIds }});
  } catch {
    console.log("Can't delete comments.");
    return functions.response(res, 500);
  }

  try {
    await PostsModel.deleteMany({ userId : req.params.userId });
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

  try {
    await UsersModel.deleteOne({ _id : req.params.userId });
  } catch {
    console.log("Can't delete user.");
    return functions.response(res, 500);
  }

  const userImageToDelete = user.imageUrl.split('images/')[1];
  if (userImageToDelete !== defaultImageToKeep) {
    await fs.promises.unlink(`images/${userImageToDelete}`)
      .catch(() => console.log(`Can't delete ${userImageToDelete}.`));
  }

  return functions.response(res, 200);
};
