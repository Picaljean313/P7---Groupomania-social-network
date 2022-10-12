const validationRules = (thing) => {
  if (thing.required === false && thing.value === undefined ) return true
  if (Number.isNaN(thing.value) && thing.required === false ) return true
  if (Number.isNaN(thing.value) && thing.required === true) return false
  if (typeof thing.value !== thing.expectedType) return false
  if (thing.expectedType === "string"){
    try {
      if (thing.mask !== undefined && !thing.mask.test(thing.value)) return false
    } catch {
      return false
    }
    if (thing.expectedValue !== undefined && !thing.expectedValue.includes(thing.value)) return false
    if (thing.minLength !== undefined && thing.value.length < thing.minLength) return false
    if (thing.maxLength !== undefined && thing.value.length > thing.maxLength) return false
  }
  if (thing.expectedType === "number"){
    if (thing.isInteger === true && !Number.isInteger(thing.value)) return false
    if (thing.minValue !== undefined && thing.value < thing.minValue) return false
    if (thing.maxValue !== undefined && thing.value > thing.maxValue) return false
  }
  if (typeof thing.value === 'object'){
    if (thing.expectedMimetype !== undefined){
      if (Array.isArray(thing.expectedMimetype)){
        if (!thing.expectedMimetype.includes(thing.value.mimetype)) return false
      } else {
        if (thing.value.mimetype !== thing.expectedMimetype) return false
      }
    }
  }
  else return true
};

exports.valid = (thingToValidate, data) => {
  return !thingToValidate(data).map(validationRules).includes(false)
};