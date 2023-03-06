const basePath = "http://localhost:3001/api";

const pagesData = {
  welcome : {
    title : "Welcome",
    nav : []
  },
  signUp : {
    title : "Sign Up",
    nav : ["welcome"],
    inputs : ["pseudo", "avatar", "theme", "email", "confirmPassword"],
    data : {
      formDataTextFieldName : "user",
      keys : ["pseudo", "theme", "email", "password"]
    },
    fetchUrl : `${basePath}/users/signup`
  },
  logIn : {
    title : "Log In",
    nav : ["welcome"],
    inputs : ["email", "password"],
    data : {
      keys : ["email", "password"]
    },
    fetchUrl : `${basePath}/users/login`
  },
  home : {
    title : "Home",
    nav : ["logOut"]
  },
  myProfile : {
    title : "My profile",
    nav : ["welcome", "home"]
  },
  modifyMyProfile : {
    title : "Modify my profile",
    nav : ["welcome", "home", "back"]
  },
  myAdminProfile : {
    title : "My admin profile",
    nav : ["welcome", "home"]
  },
  createUser : {
    title : "Create a user",
    nav : ["welcome", "home", "myAdminProfile"]
  },
  allProfiles : {
    title : "All profiles from users",
    nav : ["welcome", "home", "myAdminProfile"]
  },
  userProfile : {
    title : "User profile",
    nav : ["welcome", "home", "myAdminProfile", "allProfiles"]
  },
  modifyUserProfile : {
    title : "Modify a user profile",
    nav : ["welcome", "home", "myAdminProfile", "allProfiles", "userProfile"]
  },
  allPostsFromUser : {
    title : "All posts from a user",
    nav : ["welcome", "home", "myAdminProfile", "allUserProfiles", "userProfile"]
  }
} 

export {pagesData, basePath};