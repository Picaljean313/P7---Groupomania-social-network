import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { Context } from '../../utils/Context';


const StyledCreateUser = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainCreateUser {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}
`

function CreateUser () {
  const {token} = useContext(Context);
  const navigate = useNavigate();

  const initialInputsValidationStatus = {
    pseudo : false,
    avatar : true,
    theme : true,
    email : false,
    isAdmin : true,
    password : false
  }
  const [inputsValidationStatus, setInputsValidationStatus] = useState(initialInputsValidationStatus);

  const initialFormInputsData = {
    pseudo : "",
    avatar : undefined,
    theme : "original",
    email : "",
    isAdmin : false,
    password : ""
  };
  const [formInputsData, setFormInputsData] = useState(initialFormInputsData);

  const handleOnSubmit = async function (event) {
    event.preventDefault();
    
    const isFormValid = !Object.values(inputsValidationStatus).includes(false);

    if (!isFormValid) {
      return alert ("Please fill all inputs");
    } else {
      const dataToSend = {
        pseudo : formInputsData.pseudo,
        theme : formInputsData.theme,
        email : formInputsData.email,
        isAdmin : formInputsData.isAdmin === "true",
        password : formInputsData.password
      };

      if (Object.keys(formInputsData).includes("avatar") && formInputsData["avatar"] !== undefined) {
        const formData = new FormData();
        formData.append("user", JSON.stringify(dataToSend));
        formData.append("image", event.target.avatar.files[0]);
        console.log(dataToSend)

        const res = await fetch(`${basePath}/users`, {
          method : "POST",
          headers : {
            'Authorization' : `Bearer ${token}`
          },
          body : formData
        });

        if (res.status === 200 || res.status === 201) {
          document.getElementById("pseudo").value = ""; 
          document.getElementById("theme").value = "original"; 
          document.getElementById("email").value = ""; 
          document.getElementById("password").value = ""; 
          document.getElementById("isAdmin").value = false; 
          return alert ("User created")
        } 
        else {
          return console.log("Can't create user")
        }
      } 
      else {
        const res = await fetch(`${basePath}/users`, {
          method : "POST",
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
            },
          body : JSON.stringify(dataToSend)
        });

        if (res.status === 200 || res.status === 201) {
          document.getElementById("pseudo").value = ""; 
          document.getElementById("theme").value = "original"; 
          document.getElementById("email").value = ""; 
          document.getElementById("password").value = ""; 
          document.getElementById("isAdmin").value = false; 
          return alert ("User created")
        } 
        else {
          return console.log("Can't create user")
        }
      }
    }
  };

  const handleCancelOnClick = () => {
    navigate(-1);
  };

  return (
      <StyledCreateUser>
        <Header />
        <div className = "mainCreateUser" >
          <form onSubmit={handleOnSubmit} >
            <TextInput name="pseudo" defaultValue="" className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue="" className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue="" className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="isAdmin" defaultValue="" className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <ConfirmPasswordInput name="password" className="createUser" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <div className="loginFormButtonsContainer">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelOnClick}>Cancel</button>
            </div>
          </form>
        </div>
      </StyledCreateUser>
      )
}
export default CreateUser;