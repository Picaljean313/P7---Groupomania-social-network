import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ChangePasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';

const StyledModifyMyProfile = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainModifyMyProfile {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}

.changePasswordContainer {
  display : flex;
}

.changePasswordContainer button {
  margin : 0 0 0 50px;
}
`

function ModifyMyProfile () {
  const {userData, setUserData, token, setTheme} = useContext(Context);
  const navigate = useNavigate();

  const initialInputsValidationStatus = {
    pseudo : false,
    avatar : false,
    theme : false,
    email : false,
    password : false
  }
  const [inputsValidationStatus, setInputsValidationStatus] = useState(initialInputsValidationStatus);

  const initialFormInputsData = {
    pseudo : userData.pseudo,
    avatar : undefined,
    theme : userData.theme,
    email : userData.email,
    formerPassword : "",
    password : ""
  };
  
  const [formInputsData, setFormInputsData] = useState(initialFormInputsData);

  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleCancelOnClick = () => {
    navigate(-1);
  };

  const changePasswordOnClick = () => {
    setIsChangePassword(true);
  };

  const cancelChangePasswordOnClick = () => {
    const newFormInputsData = formInputsData;
    newFormInputsData.formerPassword = "";
    newFormInputsData.password = "";
    setFormInputsData(newFormInputsData);
    const newInputsValidationStatus = inputsValidationStatus;
    newInputsValidationStatus.password = false;
    setInputsValidationStatus(newInputsValidationStatus);
    setIsChangePassword(false);
  };

  const handleOnSubmit = async function (event) {
    event.preventDefault();
    console.log(userData);
    console.log(initialFormInputsData);
    console.log(formInputsData);
    console.log(inputsValidationStatus);

    let isDataChanged = false;
    let isImageToSend = false;
    let dataToSend = {};
    let isFormValid = false;

    if (document.getElementById("avatar").files[0] !== undefined) {
      isDataChanged = true;
      isImageToSend = true;
    }

    if (!isChangePassword){
      const newInputsValidationStatus = {};
      for (let key of Object.keys(inputsValidationStatus)){
        if (["pseudo", "avatar", "theme", "email"].includes(key)){
          newInputsValidationStatus[key] = inputsValidationStatus[key];
        }
      };

      for (let key of Object.keys(formInputsData)){
        if (["pseudo", "theme", "email"].includes(key) && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key];
        }
      };

      isFormValid = (!Object.values(newInputsValidationStatus).includes(false) && isDataChanged);
    } 
    else {
      for (let key of Object.keys(formInputsData)){
        if (["pseudo", "theme", "email"].includes(key) && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key];
        }
        if (key === "password" && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key];
        }
      };

      isFormValid = (!Object.values(inputsValidationStatus).includes(false) && isDataChanged);
    }
      
    console.log(isDataChanged);
    console.log(dataToSend);
    console.log(isFormValid);

    if (!isFormValid) return alert ("Changes are not valid")

    if (isImageToSend) {
      const formData = new FormData();
      formData.append("image", document.getElementById("avatar").files[0]);

      if (Object.keys(dataToSend).length !== 0) {
        formData.append("user", JSON.stringify(dataToSend));
      }

      const res = await fetch(`${basePath}/users/${userData._id}`, {
        method : "PUT",
        headers : {
          'Authorization' : `Bearer ${token}`
        },
        body : formData
      });

      if (res.status === 200){
        const newUserData = await res.json();
        document.getElementById("avatar").value = "";

        newUserData["activity"] = userData.activity;
        sessionStorage.setItem("GroupomaniaUserData", JSON.stringify(newUserData));
        setUserData(newUserData);

        if (newUserData.theme !== userData.theme){
          setTheme(newUserData.theme);
        }

        return alert ("Changes succeeded")
      }
      else {
        return console.log("Changes failed")
      }
    }
    else {
      const res = await fetch(`${basePath}/users/${userData._id}`, {
        method : "PUT",
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
          },
        body : JSON.stringify(dataToSend)
      });

      if (res.status === 200){
        const newUserData = await res.json();

        newUserData["activity"] = userData.activity;
        sessionStorage.setItem("GroupomaniaUserData", JSON.stringify(newUserData));
        setUserData(newUserData);

        if (newUserData.theme !== userData.theme){
          setTheme(newUserData.theme);
        }

        return alert ("Changes succeeded")
      }
      else {
        return console.log("Changes failed")
      }
    }
  };

  return (
      <StyledModifyMyProfile>
        <Header />
        <div className="mainModifyMyProfile">
          <h2>Change your data :</h2>
          <form onSubmit={handleOnSubmit} >
            <TextInput name="pseudo" defaultValue={userData.pseudo} className="modifyMyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="modifyMyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue={userData.theme} className="modifyMyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue={userData.email} className="modifyMyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            {!isChangePassword ?
            <button onClick={changePasswordOnClick} >
              Change your password
            </button> : 
            <div className="changePasswordContainer" >
              <ChangePasswordInput name="password" defaultValue="" className="modifyMyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
              <button onClick={cancelChangePasswordOnClick} >
                Don't change password
              </button>
            </div>} 
            <div className="loginFormButtonsContainer">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelOnClick}>Cancel</button>
            </div>
          </form>
        </div>
      </StyledModifyMyProfile>
    )
}
export default ModifyMyProfile;