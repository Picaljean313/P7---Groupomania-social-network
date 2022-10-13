exports.userIdToValidate = (userId) => {
  return [
    {
      value : userId,
      expectedType : "string",
      mask : /^[a-f0-9]+$/,
      minLength : 24,
      maxLength : 24
    }
  ]
};