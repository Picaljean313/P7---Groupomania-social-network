exports.idToValidate = (id) => {
  return [
    {
      value : id,
      expectedType : "string",
      mask : /^[a-f0-9]+$/,
      minLength : 24,
      maxLength : 24
    }
  ]
};