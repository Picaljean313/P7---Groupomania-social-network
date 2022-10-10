exports.userFormDataToValidate = (user) => {
  try {
    return [
      {
        value : user,
        expectedType : "string",
        maxLength : 1000
      },
      {
        value : JSON.parse(user),
        expectedType : "object"
      }
    ]
  }
  catch {
    return [
      {
        value : "string",
        expectedType : "number"
      }
    ]
  }
};


exports.userJsonDataToValidate = (user) => {
  try {
    return [
      {
        value : user.pseudo,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 20
      },
      {
        value : user.theme,
        required : false,
        expectedType : "string",
        mask : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/,
        maxLength : 20
      },
      {
        value : user.email,
        expectedType : "string",
        mask : /^[^\s\.@]{1,50}@[^\s\.@]{1,50}\.[^\s\.@]{1,10}$/
      },
      {
        value : user.password,
        expectedType : "string",
        mask : /^\S+$/,
        minLength : 3,
        maxLength : 20
      }
    ]
  }
  catch {
    return [
      {
        value : "string",
        expectedType : "number"
      }
    ]
  }
};