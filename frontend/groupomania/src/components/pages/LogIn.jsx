import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import basePath from '../../utils/basePath';
import { TextInput } from '../atoms/Inputs';
import { useNavigate } from 'react-router';
import { Context } from '../../utils/Context';
import colors from '../../utils/colors';

const StyledLogIn = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainLogin {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.loginForm {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 20px;
  margin : 100px 0 40px 0;
  padding : 20px 0 10px 0;
  width :490px;
}

.loginTextInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.loginTextInput label {
  width : 140px;
  font-size : 20px;
}

.loginTextInput input {
  flex:1;
  font-size : 16px;
  color : ${colors.tertiary};
}

.loginFormButtonsContainer {
  display : flex;
}

.loginFormButtonsContainer button {
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

@media screen and (min-width: 400px) and (max-width: 519px) {
  .loginForm {
    width : 370px;
  }

  .loginTextInput {
    width : 330px;
  }
  
  .loginTextInput label {
    width : 80px;
    font-size : 16px;
  }
}

@media screen and (max-width: 399px) {
  .loginForm {
    width : 90%;
  }

  .loginTextInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .loginTextInput label {
    width : 80px;
    font-size : 16px;
    margin-bottom : 10px;
  }
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
        <form className="loginForm" onSubmit={handleOnSubmit} >
          <TextInput name="email" defaultValue="" className="loginTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <TextInput name="password" defaultValue="" className="loginTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
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