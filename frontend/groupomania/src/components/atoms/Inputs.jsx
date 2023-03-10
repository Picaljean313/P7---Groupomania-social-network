import React, { useState } from "react";
import styled from "styled-components";

const StyledInput = styled.div`
img {
  height : 300px;
  width : 300px;
  object-fit : cover;
}
${props => props.className === "signUp" && `
background-color : yellow;
`}
${props => props.inputIsValid && `
color : green;
select {
  color : blue;
}
input::file-selector-button {
  background-color : blue;
}
`}
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
      maxLength : 15
    },
    email : {
      label : "Email : ",
      type : "email", 
      regex : /^[^\s@]{1,25}@[^\s\.@]{1,18}\.[^\s\.@]{1,5}$/, 
      minLength : 4,
      maxLength : 50
    },
    password : {
      label : "Password : ",
      type : "password", 
      regex : /^\S+$/, 
      minLength : 3,
      maxLength : 20
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

  if (inputIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = inputIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }
  
  const handleOnChange = (event) => {
    const value = event.target.value;
    setInputIsValid(checkValue(value));

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

  if (inputIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = inputIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }

  const handleOnChange = (event) => {
    const value = event.target.value;

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
        {name : "original", label : "Original"}, 
        {name : "christmas", label : "Christmas"}, 
        {name : "cliffs", label : "Cliffs"}, 
        {name : "river", label : "River"}, 
        {name : "sea", label : "Sea"}, 
        {name : "sun", label : "Sun"}
      ]
    }
  };

  const inputIsValid = true; /* Une prise en compte de critères se fera peut-être plus tard */

  if (inputIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = inputIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }

  const handleOnChange = (event) => {
    const value = event.target.value;

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
          <option key={e.name} value = {e.name} >{e.label}</option>
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
      maxLength : 20
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

 
  if (confirmPasswordIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = confirmPasswordIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }
  
  const handlePasswordOnChange = (event) => {
    const value = event.target.value;
    setPasswordValue(value);
    setPasswordIsValid(checkValue(value));

    if (value === confirmPasswordValue && checkValue(value) && confirmPasswordIsValid === false) {
      setConfirmPasswordIsValid(true);
    }

    if (value !== confirmPasswordValue && confirmPasswordIsValid === true) {
      setConfirmPasswordIsValid(false);
    }
  }

  const handleConfirmPasswordOnChange = (event) => {
    const value = event.target.value;
    setConfirmPasswordValue(value);

    if (value === passwordValue && checkValue(value) && confirmPasswordIsValid === false) {
      setConfirmPasswordIsValid(true)
    }

    if ((value !== passwordValue && confirmPasswordIsValid === true) || (!checkValue(value) && confirmPasswordIsValid === true)) {
      setConfirmPasswordIsValid(false);
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
      maxLength : 20
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
 
  const allInputsAreValid = (formerPasswordIsValid && confirmNewPasswordIsValid);
  if (allInputsAreValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = allInputsAreValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }
  
  const handleFormerPasswordOnChange = (event) => {
    const value = event.target.value;
    setFormerPasswordValue(value);
    setFormerPasswordIsValid(checkValue(value));

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

    if (value === confirmNewPasswordValue && confirmNewPasswordIsValid === true){
      setConfirmNewPasswordIsValid(false);
    }
    if (value !== confirmNewPasswordValue && newPasswordValue === confirmNewPasswordValue && checkValue(confirmNewPasswordValue) && confirmNewPasswordIsValid === false){
      setConfirmNewPasswordIsValid(true);
    }
  }

  const handleNewPasswordOnChange = (event) => {
    const value = event.target.value;
    setNewPasswordValue(value);
    setNewPasswordIsValid(checkValue(value));

    if (value === confirmNewPasswordValue && value !== formerPasswordValue && checkValue(value) && confirmNewPasswordIsValid === false) {
      setConfirmNewPasswordIsValid(true);
    }

    if (value !== confirmNewPasswordValue && confirmNewPasswordIsValid === true) {
      setConfirmNewPasswordIsValid(false);
    }
  }

  const handleConfirmNewPasswordOnChange = (event) => {
    const value = event.target.value;
    setConfirmNewPasswordValue(value);

    if (value === newPasswordValue && value !== formerPasswordValue && checkValue(value) && confirmNewPasswordIsValid === false) {
      setConfirmNewPasswordIsValid(true)
    }

    if ((value !== newPasswordValue && confirmNewPasswordIsValid === true) || (!checkValue(value) && confirmNewPasswordIsValid === true)) {
      setConfirmNewPasswordIsValid(false);
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
    <div className="changePasswordInputsContainer" >
      <StyledInput className = {className} inputIsValid = {formerPasswordIsValid} >
        <label htmlFor = "formerPassword" >Former password : </label>
        <input id = "formerPassword" name = "formerPassword" type = "password" maxLength = {data["password"].maxLength} autoComplete = "off" onChange = { handleFormerPasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {newPasswordIsValid} >
        <label htmlFor = "password" >New password : </label>
        <input id = "password" name = "password" type = "password" maxLength = {data["password"].maxLength } autoComplete = "off" onChange = { handleNewPasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {confirmNewPasswordIsValid} >
        <label htmlFor = "confirmNewPassword" >Confirm new password : </label>
        <input id = "confirmNewPassword" name = "confirmNewPassword" type = "password" maxLength = {data["password"].maxLength } autoComplete = "off" onChange = { handleConfirmNewPasswordOnChange } />
      </StyledInput>
    </div>
  );
}

export {ErrorInput, TextInput, FileInput, SelectInput, ConfirmPasswordInput, ChangePasswordInput};