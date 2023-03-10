import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { useNavigate } from 'react-router';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';

const StyledSignUp = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainSignup {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}
`

function SignUp () {
  const navigate = useNavigate();
  const {setToken} = useContext(Context);

  const initialInputsValidationStatus = {
    pseudo : false,
    avatar : false,
    theme : false,
    email : false,
    password : false
  }
  const [inputsValidationStatus, setInputsValidationStatus] = useState(initialInputsValidationStatus);

  const initialFormInputsData = {
    pseudo : "",
    avatar : undefined,
    theme : "original",
    email : "",
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
        password : formInputsData.password
      };

      if (Object.keys(formInputsData).includes("avatar") && formInputsData["avatar"] !== undefined) {
        const formData = new FormData();
        formData.append("user", JSON.stringify(dataToSend));
        formData.append("image", event.target.avatar.files[0]);

        const resSignUp = await fetch(`${basePath}/users/signup`, {
          method : "POST",
          body : formData
        });

        if (resSignUp.status === 200 || resSignUp.status === 201) {
          const resLogIn = await fetch(`${basePath}/users/login`, {
            method : "POST",
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json' 
              },
            body : JSON.stringify({
              email : formInputsData["email"],
              password : formInputsData["password"]
            })
          });
          if (resLogIn.status === 200 || resLogIn.status === 201) {
            const apiData = await resLogIn.json();
            return setToken(apiData.token);
          }
        } 
        return console.log("Can't sign up")
      } 
      else {
        const resSignUp = await fetch(`${basePath}/users/signup`, {
          method : "POST",
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
            },
          body : JSON.stringify(dataToSend)
        });

        if (resSignUp.status === 200 || resSignUp.status === 201) {
          const resLogIn = await fetch(`${basePath}/users/login`, {
            method : "POST",
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json' 
              },
            body : JSON.stringify({
              email : formInputsData["email"],
              password : formInputsData["password"]
            })
          }); 
          if (resLogIn.status === 200 || resLogIn.status === 201) {
            const apiData = await resLogIn.json();
            return setToken(apiData.token);
          }
        } 
        
        return console.log("Can't sign up")
      }
    }
  };

  const handleCancelOnClick = () => {
    navigate(-1);
  };

  return (
    <StyledSignUp>
      <Header />
      <div className="mainSignup">
        <form onSubmit={handleOnSubmit} >
          <TextInput name="pseudo" defaultValue="" className="signUp" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <FileInput name="avatar" defaultValue={undefined} className="signUp" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <SelectInput name="theme" defaultValue="" className="signUp" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <TextInput name="email" defaultValue="" className="signUp" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <ConfirmPasswordInput name="password" className="signUp" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <div className="loginFormButtonsContainer">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancelOnClick}>Cancel</button>
          </div>
        </form>
      </div>
    </StyledSignUp>
    )
}
export default SignUp;