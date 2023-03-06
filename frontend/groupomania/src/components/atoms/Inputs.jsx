import React, { useState } from "react";
import styled from "styled-components";
import inputsDatas from "../../utils/inputsDatas";

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

  const checkValue = (value) => {
    try {
      if (value.length > inputsDatas[name].maxLength || value.length < inputsDatas[name].minLength || !inputsDatas[name].regex.test(value)) return false
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

    const newFormInputsData = formInputsData;
    newFormInputsData[name] = value;
    setFormInputsData(newFormInputsData);
  }

  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid}>
      <label htmlFor = {name} >{inputsDatas[name].label}</label>
      <input id = {name} name = {name} type = { inputsDatas[name].type } maxLength = { inputsDatas[name].maxLength } defaultValue = {defaultValue} onChange = { handleOnChange } autoComplete={name === "email" ? "on" : "off"} />
    </StyledInput>
  );
}

function FileInput ({name, className, defaultValue, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {
  const inputIsValid = true; /* Une prise en compte de critères se fera peut-être plus tard (taille de la photo, etc)*/

  if (inputIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = inputIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }

  const handleOnChange = (event) => {
    const value = event.target.value;

    const newFormInputsData = formInputsData;
    newFormInputsData[name] = value;
    setFormInputsData(newFormInputsData);
  }

  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid} >
      {defaultValue !== undefined && <img src= {defaultValue} alt = "Avatar" />}
      <label htmlFor = {name} >{inputsDatas[name].label}</label>
      <input id = {name} name = {name} type = "file" accept = {inputsDatas[name].accept} onChange = { handleOnChange } />
    </StyledInput>
  );
}

function SelectInput ({name, className, defaultValue, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {
  const inputIsValid = true; /* Une prise en compte de critères se fera peut-être plus tard */

  if (inputIsValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = inputIsValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }

  const handleOnChange = (event) => {
    const value = event.target.value;

    const newFormInputsData = formInputsData;
    newFormInputsData[name] = value;
    setFormInputsData(newFormInputsData);
  }
  
  return (
    <StyledInput className = {className} inputIsValid = {inputIsValid} >
      <label htmlFor={name}>{inputsDatas[name].label}</label>
      <select id = {name} name = {name} defaultValue = {defaultValue} onChange = { handleOnChange } >
        {inputsDatas[name].options.map(e =>
          <option key={e.name} value = {e.name} >{e.label}</option>
        )}
      </select>
    </StyledInput>
  );
}

function ConfirmPasswordInput ({name, className, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const checkValue = (value) => {
    try {
      if (value.length > inputsDatas["password"].maxLength || value.length < inputsDatas["password"].minLength || !inputsDatas["password"].regex.test(value)) return false
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

    const newFormInputsData = formInputsData;
    newFormInputsData[name] = value;
    setFormInputsData(newFormInputsData);
  }

  return (
    <React.Fragment>
      <StyledInput className = {className} inputIsValid = {passwordIsValid} >
        <label htmlFor = "password" >{inputsDatas["password"].label}</label>
        <input id = "password" name = "password" type = {inputsDatas["password"].type} maxLength = { inputsDatas["password"].maxLength } autoComplete = "off" onChange = { handlePasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {confirmPasswordIsValid} >
        <label htmlFor = {name} >{inputsDatas[name].label}</label>
        <input id = {name} name = {name} type = { inputsDatas[name].type } maxLength = { inputsDatas[name].maxLength } autoComplete = "off" onChange = { handleConfirmPasswordOnChange } />
      </StyledInput>
    </React.Fragment>
  );
}

function ChangePasswordInput  ({name, className, inputsValidationStatus, setInputsValidationStatus, formInputsData, setFormInputsData}) {

  const checkValue = (value) => {
    try {
      if (value.length > inputsDatas["password"].maxLength || value.length < inputsDatas["password"].minLength || !inputsDatas["password"].regex.test(value)) return false
      else return true
    }
    catch {console.log(`Can't check value from input ${name}`)}
  };

  const [formerPasswordValue, setFormerPasswordValue] = useState("");
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [formerPasswordIsValid, setFormerPasswordIsValid] = useState(checkValue(""));
  const [changePasswordIsValid, setChangePasswordIsValid] = useState (checkValue(""));
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(checkValue(""));

  if (formerPasswordIsValid !== false && formerPasswordIsValid !== true) return <ErrorInput />
  if (changePasswordIsValid !== false && changePasswordIsValid !== true) return <ErrorInput />
  if (confirmPasswordIsValid !== false && confirmPasswordIsValid !== true) return <ErrorInput />
 
  const allInputsAreValid = formerPasswordIsValid && confirmPasswordIsValid;
  if (allInputsAreValid !== inputsValidationStatus[name]) {
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus[name] = allInputsAreValid;
    setInputsValidationStatus(newInputsValidationStatus);
  }
  
  const handleFormerPasswordOnChange = (event) => {
    const value = event.target.value;
    setFormerPasswordValue(value);
    setFormerPasswordIsValid(checkValue(value));

    const newFormInputsData = formInputsData;
    newFormInputsData[name].formerPassword = value;
    setFormInputsData(newFormInputsData);
  }

  const handleChangePasswordOnChange = (event) => {
    const value = event.target.value;
    setChangePasswordValue(value);
    setChangePasswordIsValid(checkValue(value));

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

    if (value === changePasswordValue && checkValue(value) && confirmPasswordIsValid === false) {
      setConfirmPasswordIsValid(true)
    }

    if ((value !== changePasswordValue && confirmPasswordIsValid === true) || (!checkValue(value) && confirmPasswordIsValid === true)) {
      setConfirmPasswordIsValid(false);
    }

    const newFormInputsData = formInputsData;
    newFormInputsData[name].confirmPassword = value;
    setFormInputsData(newFormInputsData);
  }

  return (
    <React.Fragment>
    <StyledInput className = {className} inputIsValid = {formerPasswordIsValid} >
      <label htmlFor = "formerPassword" >{inputsDatas["formerPassword"].label}</label>
      <input id = {"formerPassword"} name = {"formerPassword"} type = { inputsDatas["formerPassword"].type } maxLength = { inputsDatas["formerPassword"].maxLength } autoComplete = "off" onChange = { handleFormerPasswordOnChange } />
    </StyledInput>
      <StyledInput className = {className} inputIsValid = {changePasswordIsValid} >
        <label htmlFor = {name} >{inputsDatas[name].label}</label>
        <input id = {name} name = {name} type = {inputsDatas[name].type} maxLength = { inputsDatas[name].maxLength } autoComplete = "off" onChange = { handleChangePasswordOnChange } />
      </StyledInput>
      <StyledInput className = {className} inputIsValid = {confirmPasswordIsValid} >
        <label htmlFor = "confirmPassword" >{inputsDatas["confirmPassword"].label}</label>
        <input id = {"confirmPassword"} name = {"confirmPassword"} type = { inputsDatas["confirmPassword"].type } maxLength = { inputsDatas["confirmPassword"].maxLength } autoComplete = "off" onChange = { handleConfirmPasswordOnChange } />
      </StyledInput>
    </React.Fragment>
  );
}

export {ErrorInput, TextInput, FileInput, SelectInput, ConfirmPasswordInput, ChangePasswordInput};