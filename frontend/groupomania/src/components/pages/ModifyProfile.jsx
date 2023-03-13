import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';

const StyledModifyProfile = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainModifyProfile {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}

.confirmPasswordContainer {
  display : flex;
}

.confirmPasswordContainer button {
  margin : 0 0 0 50px;
}
`

function ModifyProfile () {
  const {userData, setUserData, token, setTheme, profileData, setProfileData} = useContext(Context);
  const navigate = useNavigate();

  const initialInputsValidationStatus = {
    pseudo : true,
    avatar : true,
    theme : true,
    email : true,
    isAdmin : true,
    password : false
  }
  const [inputsValidationStatus, setInputsValidationStatus] = useState(initialInputsValidationStatus);

  const initialFormInputsData = {
    pseudo : profileData.pseudo,
    avatar : undefined,
    theme : profileData.theme,
    email : profileData.email,
    isAdmin : profileData.isAdmin,
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
    setIsChangePassword(false);
  };

  const handleOnSubmit = async function (event) {
    event.preventDefault();

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
        if (["pseudo", "avatar", "theme", "email", "isAdmin"].includes(key)){
          newInputsValidationStatus[key] = inputsValidationStatus[key];
        }
      };

      for (let key of Object.keys(formInputsData)){
        if (["pseudo", "theme", "email"].includes(key) && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key];
        }
        if (key === "isAdmin" && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key] === "true";
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
        if (key === "isAdmin" && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key] === "true";
        }
        if (key === "password" && formInputsData[key] !== initialFormInputsData[key]){
          isDataChanged = true;
          dataToSend[key] = formInputsData[key];
        }
      };

      isFormValid = (!Object.values(inputsValidationStatus).includes(false) && isDataChanged);
    }

    if (!isFormValid) return alert ("Changes are not valid");

    if (isImageToSend) {
      const formData = new FormData();
      formData.append("image", document.getElementById("avatar").files[0]);

      if (Object.keys(dataToSend).length !== 0) {
        formData.append("user", JSON.stringify(dataToSend));
      }

      const res = await fetch(`${basePath}/users/${profileData._id}`, {
        method : "PUT",
        headers : {
          'Authorization' : `Bearer ${token}`
        },
        body : formData
      });

      if (res.status === 200){
        const newUserData = await res.json();
        document.getElementById("avatar").value = "";

        newUserData["activity"] = profileData.activity;
        sessionStorage.setItem("GroupomaniaProfileData", JSON.stringify(newUserData));
        setProfileData(newUserData);

        alert ("Changes succeeded")
      }
      else {
        return console.log("Changes failed")
      }
    }
    else {
      console.log(dataToSend)
      const res = await fetch(`${basePath}/users/${profileData._id}`, {
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

        newUserData["activity"] = profileData.activity;
        sessionStorage.setItem("GroupomaniaProfileData", JSON.stringify(newUserData));
        setProfileData(newUserData);

        alert ("Changes succeeded");
      }
      else {
        return console.log("Changes failed")
      }
    }

    return navigate(`/userProfile/${profileData._id}`);
  };

  return (
      <StyledModifyProfile>
        <Header />
        <div className="mainModifyProfile">
          <h2>Change user data :</h2>
          <form onSubmit={handleOnSubmit} >
            <TextInput name="pseudo" defaultValue={profileData.pseudo} className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue={profileData.theme} className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue={profileData.email} className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="isAdmin" defaultValue={profileData.isAdmin} className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            {!isChangePassword ?
            <button onClick={changePasswordOnClick} >
              Change user password
            </button> : 
            <div className="confirmPasswordContainer" >
              <ConfirmPasswordInput name="password" defaultValue="" className="modifyProfile" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
              <button onClick={cancelChangePasswordOnClick} >
                Don't change password
              </button>
            </div>} 
            <div className="modifyProfileFormButtonsContainer">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelOnClick}>Cancel</button>
            </div>
          </form>
        </div>
      </StyledModifyProfile>
    )
}
export default ModifyProfile;