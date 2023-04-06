import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ChangePasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';
import colors from '../../utils/colors';

const StyledModifyMyProfile = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainModifyMyProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.modifyMyProfileForm {
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

.modifyMyProfileForm h2 {
  background-color : #ececf0;
  border-radius : 20px;
  border: outset 3px #ececf0;
  color : ${colors.tertiary};
  font-size : 24px;
  padding : 10px;
  margin : 20px 0 10px 0;
}

.modifyMyProfileTextInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyMyProfileTextInput label {
  width : 140px;
  font-size : 20px;
}

.modifyMyProfileTextInput input {
  flex:1;
  font-size : 16px;
  color : ${colors.tertiary};
}

.modifyMyProfileSelectInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyMyProfileSelectInput label {
  width : 140px;
  font-size : 20px;
}

.modifyMyProfileSelectInput select {
  flex : 1;
  font-size : 16px;
  text-align : center;
}

.modifyMyProfileFileInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyMyProfileFileInput label {
  width : 140px;
  font-size : 20px;
}

.modifyMyProfileFileInput input {
  flex : 1;
  font-size : 16px;
}

.modifyMyProfileConfirmPasswordInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.modifyMyProfileConfirmPasswordInput label {
  width : 140px;
  font-size : 20px;
}

.modifyMyProfileConfirmPasswordInput input {
  width : 300px;
  font-size : 16px;
}

.modifyMyProfileChangePasswordButton {
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

.changePasswordContainer {
  display : flex;
  flex-direction : column;
  align-items : center;
}

.modifyMyProfileFormButtonsContainer {
  display : flex;
}

.modifyMyProfileFormButtonsContainer button {
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
  .modifyMyProfileForm h2 {
    font-size : 20px;
  }

  .modifyMyProfileForm {
    width : 90%;
  }

  .modifyMyProfileTextInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyMyProfileTextInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }

  .modifyMyProfileTextInput input {
    width : 280px;
    font-size : 14px;
  }

  .modifyMyProfileSelectInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyMyProfileSelectInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyMyProfileSelectInput select {
    width : 280px;
    font-size : 14px;
  }
  
  .modifyMyProfileFileInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyMyProfileFileInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyMyProfileFileInput input {
    width : 280px;
    font-size : 14px;
  }
  
  .modifyMyProfileConfirmPasswordInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .modifyMyProfileConfirmPasswordInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .modifyMyProfileConfirmPasswordInput input {
    width : 280px;
    font-size : 14px;
  }
}
`

function ModifyMyProfile () {
  const {userData, setUserData, token, setTheme} = useContext(Context);
  const navigate = useNavigate();

  const initialInputsValidationStatus = {
    pseudo : true,
    avatar : true,
    theme : true,
    email : true,
    formerPassword : false,
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

    if (!isFormValid) return alert ("Changes are not valid");

    if (isChangePassword){
      const res = await fetch(`${basePath}/users/logIn`,{
        method : "POST",
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json' 
          },
        body : JSON.stringify({
          email : userData.email,
          password : document.getElementById("formerPassword").value
        })
      });
      if (res.status === 200){
        console.log("Password change allowed");
      }
      else {
        return alert ("Check your former password");
      }
    }

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

        alert ("Changes succeeded")
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

        alert ("Changes succeeded");
      }
      else {
        return console.log("Changes failed")
      }
    }

    return navigate("/myProfile");
  };

  return (
      <StyledModifyMyProfile>
        <Header />
        <div className="mainModifyMyProfile">
          <form className="modifyMyProfileForm" onSubmit={handleOnSubmit} >
            <h2>Change your data :</h2>
            <TextInput name="pseudo" defaultValue={userData.pseudo} className="modifyMyProfileTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="modifyMyProfileFileInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue={userData.theme} className="modifyMyProfileSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue={userData.email} className="modifyMyProfileTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            {!isChangePassword ?
            <button className="modifyMyProfileChangePasswordButton" onClick={changePasswordOnClick} >
              Change your password
            </button> : 
            <div className="changePasswordContainer" >
              <ChangePasswordInput name="password" defaultValue="" className="modifyMyProfileConfirmPasswordInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
              <button className="modifyMyProfileChangePasswordButton" onClick={cancelChangePasswordOnClick} >
                Don't change password
              </button>
            </div>} 
            <div className="modifyMyProfileFormButtonsContainer">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelOnClick}>Cancel</button>
            </div>
          </form>
        </div>
      </StyledModifyMyProfile>
    )
}
export default ModifyMyProfile;