exports.loginDataToValidate = (login) => {
  try {
    return [
      {
        value : login.email,
        expectedType : "string",
        mask : /^[^\s@]{1,25}@[^\s.@]{1,18}\.[^\s.@]{1,5}$/
      },
      {
        value: login.password,
        expectedType : "string",
        mask : /^\S+$/,
        minLength : 3,
        maxLength : 10
      }
    ];
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