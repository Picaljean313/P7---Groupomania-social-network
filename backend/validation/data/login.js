exports.loginDataToValidate = (login) => {
  try {
    return [
      {
        value : login.email,
        expectedType : "string",
        mask : /^[^\s\.@]{1,50}@[^\s\.@]{1,50}\.[^\s\.@]{1,10}$/
      },
      {
        value: login.password,
        expectedType : "string",
        mask : /^\S+$/,
        minLength : 3,
        maxLength : 20
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