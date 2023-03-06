const inputsDatas = {
  pseudo : {
    label : "Pseudo : ",
    format : "text",
    type : "text", 
    regex : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/, 
    minLength : 2,
    maxLength : 20
  },
  avatar : {
    label : "Profile image : ",
    format : "file",
    type : "file", 
    accept : "image/png, image/jpeg, image/jpg"
  },
  theme : {
    label : "Theme : ",
    format : "select",
    type : "select", 
    options : [
      {name : "original", label : "Original"}, 
      {name : "christmas", label : "Christmas"}, 
      {name : "cliffs", label : "Cliffs"}, 
      {name : "river", label : "River"}, 
      {name : "sea", label : "Sea"}, 
      {name : "sun", label : "Sun"}
    ]
  },
  email : {
    label : "Email : ",
    format : "text",
    type : "email", 
    regex : /^[^\s@]{1,25}@[^\s\.@]{1,18}\.[^\s\.@]{1,5}$/, 
    minLength : 4,
    maxLength : 50
  },
  password : {
    label : "Password : ",
    format : "text",
    type : "password", 
    regex : /^\S+$/, 
    minLength : 3,
    maxLength : 20
  },
  confirmPassword : {
    name : "confirmPassword",
    label : "Confirm Password : ",
    format : "text",
    type : "password", 
    regex : /^\S+$/, 
    minLength : 3,
    maxLength : 20
  },
  formerPassword : {
    name : "formerPassword",
    label : "Former password : ",
    format : "text",
    type : "password", 
    regex : /^\S+$/, 
    minLength : 3,
    maxLength : 20
  },
  changePassword : {
    name : "changePassword",
    label : "Change password : ",
    format : "text",
    type : "password", 
    regex : /^\S+$/, 
    minLength : 3,
    maxLength : 20
  }
}

export default inputsDatas;