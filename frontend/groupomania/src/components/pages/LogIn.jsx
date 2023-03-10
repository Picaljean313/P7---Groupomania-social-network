import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import basePath from '../../utils/basePath';
import { TextInput } from '../atoms/Inputs';
import { useNavigate } from 'react-router';
import { Context } from '../../utils/Context';

const StyledLogIn = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainLogin {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}

.loginFormButtonsContainer {
  display : flex;
  justify-content : space-around;
}
`

function LogIn () {
  const navigate = useNavigate();
  const {setToken} = useContext(Context);
  
  const initialInputsValidationStatus = {
    email : false,
    password : false
  }
  const [inputsValidationStatus, setInputsValidationStatus] = useState(initialInputsValidationStatus);

  const initialFormInputsData = {
    email : "",
    password : ""
  };
  const [formInputsData, setFormInputsData] = useState(initialFormInputsData);

  const handleOnSubmit = async function (event) {
    event.preventDefault();

    const isFormValid = !Object.values(inputsValidationStatus).includes(false);

    if (!isFormValid) {
      alert ("Please fill all inputs");
      return
    } else {
      const res = await fetch(`${basePath}/users/login`, {
        method : "POST",
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json' 
          },
        body : JSON.stringify(formInputsData)
      });
      if (res.status === 200 || res.status === 201) {
        const apiData = await res.json();
        return setToken(apiData.token);
      } else {
        return console.log("Can't log in");
      }
    }
  };

  const handleCancelOnClick = () => {
    navigate(-1);
  };

  return (
    <StyledLogIn>
      <Header />
      <div className="mainLogin">
        <form onSubmit={handleOnSubmit} >
          <TextInput name="email" defaultValue="" className="logIn" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <TextInput name="password" defaultValue="" className="logIn" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <div className="loginFormButtonsContainer">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancelOnClick}>Cancel</button>
          </div>
        </form>
      </div>
    </StyledLogIn>
    )
}
export default LogIn;