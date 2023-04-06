import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../utils/colors";

const StyledInput = styled.div`
img {
  height : 300px;
  width : 300px;
  object-fit : cover;
}
${props => props.inputIsValid ? `
color : #90ee90;
select {
  cursor : pointer;
  color : ${colors.tertiary};
}
input::file-selector-button {
  cursor : pointer;
  color : ${colors.tertiary};
}
` : 
`color : ${colors.secondary};
cursor : pointer;`}
`

function ErrorInput ({className}) {
  return (
    <StyledInput className = {className}>
      Can't display input
    </StyledInput>
  );
}

function TextInput ({name, defaultValue, className, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const data = {
    pseudo : {
      label : "Pseudo : ",
      type : "text", 
      regex : /^[a-zA-Z0-9][a-zA-Z0-9 \-']*[a-zA-Z0-9]$/, 
      minLength : 2,
      maxLength : 12
    },
    email : {
      label : "Email : ",
      type : "email", 
      regex : /^[^\s@]{1,25}@[^\s.@]{1,18}\.[^\s.@]{1,5}$/, 
      minLength : 4,
      maxLength : 50
    },
    password : {
      label : "Password : ",
      type : "password", 
      regex : /^\S+$/, 
      minLength : 3,
      maxLength : 10
    }
  };

  const checkValue = (value) => {
    try {
      if (value.length > data[name].maxLength || value.length < data[name].minLength || !data[name].regex.test(value)) return false
      else return true
    }
    catch {console.log(`Can't check value from input ${name}`)}
  };

  const [inputIsValid, setInputIsValid] = useState (checkValue(defaultValue));

  if (inputIsValid !== false && inputIsValid !== true) return <ErrorInput />
  
  const handleOnChange = (event) => {
    const value = event.target.value;
    setInputIsValid(checkValue(value));

    if (checkValue(value) !== inputsValidationStatus[name]) {
      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== name){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else {
          newInputsValidationStatus[key] = checkValue(value);
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== name){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }
    return setFormInputsData(newFormInputsData);
  }

  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid}>
      <label htmlFor = {name} >{data[name].label}</label>
      <input id = {name} name = {name} type = {data[name].type } maxLength = {data[name].maxLength } defaultValue = {defaultValue} onChange = { handleOnChange } autoComplete={name === "email" ? "on" : "off"} />
    </StyledInput>
  );
}

function FileInput ({name, className, defaultValue, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const data = {
    avatar : {
      label : "Profile image : ",
      accept : "image/png, image/jpeg, image/jpg"
    }
  };

  const inputIsValid = true; /* Une prise en compte de critères se fera peut-être plus tard (taille de la photo, etc)*/

  const handleOnChange = (event) => {
    const value = event.target.value;

    if (inputsValidationStatus[name] !== true) {
      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== name){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else {
          newInputsValidationStatus[key] = true;
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== name){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }

    setFormInputsData(newFormInputsData);
  }

  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid} >
      {defaultValue !== undefined && <img src= {defaultValue} alt = "Avatar" />}
      <label htmlFor = {name} >{data[name].label}</label>
      <input id = {name} name = {name} type = "file" accept = {data[name].accept} onChange = { handleOnChange } />
    </StyledInput>
  );
}

function SelectInput ({name, className, defaultValue, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const data = {
    theme : {
      label : "Theme : ",
      options : [
        {name : "original", value : "original", label : "Original"}, 
        {name : "christmas", value : "christmas", label : "Christmas"}, 
        {name : "cliffs", value : "cliffs", label : "Cliffs"}, 
        {name : "river", value : "river", label : "River"}, 
        {name : "sea", value : "sea", label : "Sea"}, 
        {name : "sun", value : "sun", label : "Sun"}
      ]
    },
    isAdmin : {
      label : "User is admin : ",
      options : [
        {name : "false", value : false, label : "False"},
        {name : "true", value : true, label : "True"}
      ]
    }
  };

  const inputIsValid = true; /* Une prise en compte de critères se fera peut-être plus tard */

  const handleOnChange = (event) => {
    const value = event.target.value;

    if (inputsValidationStatus[name] !== true) {
      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== name){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else {
          newInputsValidationStatus[key] = true;
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== name){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }

    setFormInputsData(newFormInputsData);
  }
  
  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid} >
      <label htmlFor={name}>{data[name].label}</label>
      <select id = {name} name = {name} defaultValue = {defaultValue} onChange = { handleOnChange } >
        {data[name].options.map(e =>
          <option key={e.name} value = {e.value} >{e.label}</option>
        )}
      </select>
    </StyledInput>
  );
}

function ConfirmPasswordInput ({name, className, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const data = {
    password : {
      regex : /^\S+$/, 
      minLength : 3,
      maxLength : 10
    }
  };

  const checkValue = (value) => {
    try {
      if (value.length > data["password"].maxLength || value.length < data["password"].minLength || !data["password"].regex.test(value)) return false
      else return true
    }
    catch {console.log(`Can't check value from input ${name}`)}
  };

  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState (checkValue(""));
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(checkValue(""));

  if (passwordIsValid !== false && passwordIsValid !== true) return <ErrorInput />
  if (confirmPasswordIsValid !== false && confirmPasswordIsValid !== true) return <ErrorInput />
  
  const handlePasswordOnChange = (event) => {
    const value = event.target.value;
    setPasswordValue(value);
    setPasswordIsValid(checkValue(value));

    if (value === confirmPasswordValue && checkValue(value) && confirmPasswordIsValid === false) {
      setConfirmPasswordIsValid(true); 

      if (inputsValidationStatus["password"] === false) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = true;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    if (value !== confirmPasswordValue && confirmPasswordIsValid === true) {
      setConfirmPasswordIsValid(false);
 
      if (inputsValidationStatus["password"] === true) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus["password"] = false;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    return 
  }

  const handleConfirmPasswordOnChange = (event) => {
    const value = event.target.value;
    setConfirmPasswordValue(value);

    if (value === passwordValue && checkValue(value) && confirmPasswordIsValid === false) {
      setConfirmPasswordIsValid(true);

      if (inputsValidationStatus["password"] === false) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = true;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    if ((value !== passwordValue && confirmPasswordIsValid === true) || (!checkValue(value) && confirmPasswordIsValid === true)) {
      setConfirmPasswordIsValid(false);

      if (inputsValidationStatus["password"] === true) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = false;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== name){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }
    
    return setFormInputsData(newFormInputsData);
  }

  return (
    <div className="confirmPasswordInputsContainer" >
      <StyledInput className = {className} inputIsValid = {passwordIsValid} >
        <label htmlFor = "password" >Password : </label>
        <input id = "password" name = "password" type = "password" maxLength = { data["password"].maxLength } autoComplete = "off" onChange = { handlePasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {confirmPasswordIsValid} >
        <label htmlFor = "confirmPassword" >Confirm password : </label>
        <input id = "confirmPassword" name = "confirmPassword" type = "password" maxLength = { data["password"].maxLength } autoComplete = "off" onChange = { handleConfirmPasswordOnChange } />
      </StyledInput>
    </div>
  );
}

function ChangePasswordInput  ({name, className, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const data = {
    password : {
      regex : /^\S+$/, 
      minLength : 3,
      maxLength : 10
    }
  };

  const checkValue = (value) => {
    try {
      if (value.length > data["password"].maxLength || value.length < data["password"].minLength || !data["password"].regex.test(value)) return false
      else return true
    }
    catch {console.log(`Can't check value from input ${name}`)}
  };

  const [formerPasswordValue, setFormerPasswordValue] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmNewPasswordValue, setConfirmNewPasswordValue] = useState("");
  const [formerPasswordIsValid, setFormerPasswordIsValid] = useState(checkValue(""));
  const [newPasswordIsValid, setNewPasswordIsValid] = useState (checkValue(""));
  const [confirmNewPasswordIsValid, setConfirmNewPasswordIsValid] = useState(checkValue(""));

  if (formerPasswordIsValid !== false && formerPasswordIsValid !== true) return <ErrorInput />
  if (newPasswordIsValid !== false && newPasswordIsValid !== true) return <ErrorInput />
  if (confirmNewPasswordIsValid !== false && confirmNewPasswordIsValid !== true) return <ErrorInput />
  
  const handleFormerPasswordOnChange = (event) => {
    const value = event.target.value;
    setFormerPasswordValue(value);
    setFormerPasswordIsValid(checkValue(value));

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== "formerPassword"){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }
    
    setFormInputsData(newFormInputsData);

    if (value === confirmNewPasswordValue && confirmNewPasswordIsValid === true){
      setConfirmNewPasswordIsValid(false);

      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== "password" && key !== "formerPassword"){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else if (key === "formerPassword") {
          newInputsValidationStatus["formerPassword"] = checkValue(value);
        } else {
          newInputsValidationStatus["password"] = false;
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }

    else if (value !== confirmNewPasswordValue && newPasswordValue === confirmNewPasswordValue && checkValue(confirmNewPasswordValue) && confirmNewPasswordIsValid === false){
      setConfirmNewPasswordIsValid(true);

      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== "password" && key !== "formerPassword"){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else if (key === "formerPassword") {
          newInputsValidationStatus["formerPassword"] = checkValue(value);
        } else {
          newInputsValidationStatus["password"] = true;
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }
    else {
      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (key !== "formerPassword"){
          newInputsValidationStatus[key]= inputsValidationStatus[key];
        } else {
          newInputsValidationStatus[key] = checkValue(value);
        }
      }
      setInputsValidationStatus(newInputsValidationStatus);
    }

    return 
  }

  const handleNewPasswordOnChange = (event) => {
    const value = event.target.value;
    setNewPasswordValue(value);
    setNewPasswordIsValid(checkValue(value));

    if (value === confirmNewPasswordValue && value !== formerPasswordValue && checkValue(value) && confirmNewPasswordIsValid === false) {
      setConfirmNewPasswordIsValid(true);

      if (inputsValidationStatus["password"] === false) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = true;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    if (value !== confirmNewPasswordValue && confirmNewPasswordIsValid === true) {
      setConfirmNewPasswordIsValid(false);

      if (inputsValidationStatus["password"] === true) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = false;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    return
  }

  const handleConfirmNewPasswordOnChange = (event) => {
    const value = event.target.value;
    setConfirmNewPasswordValue(value);

    if (value === newPasswordValue && value !== formerPasswordValue && checkValue(value) && confirmNewPasswordIsValid === false) {
      setConfirmNewPasswordIsValid(true);

      if (inputsValidationStatus["password"] === false) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = true;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    if ((value !== newPasswordValue && confirmNewPasswordIsValid === true) || (!checkValue(value) && confirmNewPasswordIsValid === true)) {
      setConfirmNewPasswordIsValid(false);

      if (inputsValidationStatus["password"] === true) {
        const newInputsValidationStatus = {};
        for (let key of Object.keys(inputsValidationStatus)){
          if (key !== "password"){
            newInputsValidationStatus[key]= inputsValidationStatus[key];
          } else {
            newInputsValidationStatus[key] = false;
          }
        }
        setInputsValidationStatus(newInputsValidationStatus);
      }
    }

    const newFormInputsData = {};
    for (let key of Object.keys(formInputsData)){
      if (key !== "password"){
        newFormInputsData[key] = formInputsData[key];
      }
      else {
        newFormInputsData[key] = value;
      }
    }
    
    return setFormInputsData(newFormInputsData);
  }

  return (
    <div className="changePasswordInputsContainer" >
      <StyledInput className = {className} inputIsValid = {formerPasswordIsValid} >
        <label htmlFor = "formerPassword" >Former password : </label>
        <input id = "formerPassword" name = "formerPassword" type = "password" maxLength = {data["password"].maxLength} autoComplete = "off" onChange = { handleFormerPasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {newPasswordIsValid} >
        <label htmlFor = "newPassword" >New password : </label>
        <input id = "newPassword" name = "newPassword" type = "password" maxLength = {data["password"].maxLength } autoComplete = "off" onChange = { handleNewPasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {confirmNewPasswordIsValid} >
        <label htmlFor = "confirmNewPassword" >Confirm new password : </label>
        <input id = "confirmNewPassword" name = "confirmNewPassword" type = "password" maxLength = {data["password"].maxLength } autoComplete = "off" onChange = { handleConfirmNewPasswordOnChange } />
      </StyledInput>
    </div>
  );
}

export {ErrorInput, TextInput, FileInput, SelectInput, ConfirmPasswordInput, ChangePasswordInput};