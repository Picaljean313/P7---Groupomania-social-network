import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';
import colors from '../../utils/colors';

const StyledModifyProfile = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainModifyProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.modifyProfileForm {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 20px;
  margin : 20px 0 20px 0;
  width :490px;
}

.modifyProfileForm h2 {
  background-color : #ececf0;
  border-radius : 20px;
  border: outset 3px #ececf0;
  color : ${colors.tertiary};
  font-size : 24px;
  padding : 10px;
  margin : 20px 0 10px 0;
}

.modifyProfileTextInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyProfileTextInput label {
  width : 140px;
  font-size : 20px;
}

.modifyProfileTextInput input {
  flex:1;
  font-size : 16px;
  color : ${colors.tertiary};
}

.modifyProfileSelectInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyProfileSelectInput label {
  width : 140px;
  font-size : 20px;
}

.modifyProfileSelectInput select {
  flex : 1;
  font-size : 16px;
  text-align : center;
}

.modifyProfileFileInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyProfileFileInput label {
  width : 140px;
  font-size : 20px;
}

.modifyProfileFileInput input {
  flex : 1;
  font-size : 16px;
}

.modifyProfileConfirmPasswordInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyProfileConfirmPasswordInput label {
  width : 140px;
  font-size : 20px;
}

.modifyProfileConfirmPasswordInput input {
  width : 300px;
  font-size : 16px;
}

.modifyProfileChangePasswordButton {
  height : 24px;
  border-radius : 10px;
  width : 200px;
  margin : 20px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.tertiary};
  border-color : white; 
  cursor : pointer;
}

.confirmPasswordContainer {
  display : flex;
  flex-direction : column;
  align-items : center;
}

.modifyProfileFormButtonsContainer {
  display : flex;
}

.modifyProfileFormButtonsContainer button {
  height : 30px;
  border-radius : 10px;
  width : 80px;
  margin : 20px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

@media screen and (max-width: 519px) {
  .modifyProfileForm h2 {
    font-size : 20px;
  }

  .modifyProfileForm {
    width : 90%;
  }

  .modifyProfileTextInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyProfileTextInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }

  .modifyProfileTextInput input {
    width : 280px;
    font-size : 14px;
  }

  .modifyProfileSelectInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyProfileSelectInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyProfileSelectInput select {
    width : 280px;
    font-size : 14px;
  }
  
  .modifyProfileFileInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyProfileFileInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyProfileFileInput input {
    width : 280px;
    font-size : 14px;
  }
  
  .modifyProfileConfirmPasswordInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyProfileConfirmPasswordInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyProfileConfirmPasswordInput input {
    width : 280px;
    font-size : 14px;
  }
}
`

function ModifyProfile () {
  const {token, profileData, setProfileData} = useContext(Context);
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
          <form className="modifyProfileForm" onSubmit={handleOnSubmit} >
            <h2>Change user data :</h2>
            <TextInput name="pseudo" defaultValue={profileData.pseudo} className="modifyProfileTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="modifyProfileFileInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue={profileData.theme} className="modifyProfileSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue={profileData.email} className="modifyProfileTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="isAdmin" defaultValue={profileData.isAdmin} className="modifyProfileSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            {!isChangePassword ?
            <button className="modifyProfileChangePasswordButton" onClick={changePasswordOnClick} >
              Change user password
            </button> : 
            <div className="confirmPasswordContainer" >
              <ConfirmPasswordInput name="password" defaultValue="" className="modifyProfileConfirmPasswordInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
              <button className="modifyProfileChangePasswordButton" onClick={cancelChangePasswordOnClick} >
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