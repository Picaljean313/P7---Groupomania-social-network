import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { useNavigate } from 'react-router';
import { Context } from '../../utils/Context';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import colors from '../../utils/colors';

const StyledSignUp = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainSignup {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.signupForm {
  display : flex;
  flex-direction: column;
  align-items : center;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 20px;
  margin : 40px 0 40px 0;
  padding : 20px 0 10px 0;
  width :490px;
}

.signupTextInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.signupTextInput label {
  width : 140px;
  font-size : 20px;
}

.signupTextInput input {
  flex:1;
  font-size : 16px;
  color : ${colors.tertiary};
}

.signupSelectInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.signupSelectInput label {
  width : 140px;
  font-size : 20px;
}

.signupSelectInput select {
  flex : 1;
  font-size : 16px;
  text-align : center;
}

.signupFileInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.signupFileInput label {
  width : 140px;
  font-size : 20px;
}

.signupFileInput input {
  flex : 1;
  font-size : 16px;
}

.signupConfirmPasswordInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.signupConfirmPasswordInput label {
  width : 140px;
  font-size : 20px;
}

.signupConfirmPasswordInput input {
  width : 300px;
  font-size : 16px;
  color : ${colors.tertiary};
}

.signupFormButtonsContainer {
  display : flex;
}

.signupFormButtonsContainer button {
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
  .signupForm {
    width : 90%;
  }

  .signupTextInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .signupTextInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }

  .signupTextInput input {
    width : 272px;
    font-size : 14px;
  }

  .signupSelectInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .signupSelectInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .signupSelectInput select {
    width : 280px;
    font-size : 14px;
  }
  
  .signupFileInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .signupFileInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .signupFileInput input {
    width : 280px;
    font-size : 14px;
  }
  
  .signupConfirmPasswordInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .signupConfirmPasswordInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .signupConfirmPasswordInput input {
    width : 280px;
    font-size : 14px;
  }
}
`

function SignUp () {
  const navigate = useNavigate();
  const {setToken} = useContext(Context);

  const initialInputsValidationStatus = {
    pseudo : false,
    avatar : true,
    theme : true,
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
        <form  className="signupForm" onSubmit={handleOnSubmit} >
          <TextInput name="pseudo" defaultValue="" className="signupTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <FileInput name="avatar" defaultValue={undefined} className="signupFileInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <SelectInput name="theme" defaultValue="" className="signupSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <TextInput name="email" defaultValue="" className="signupTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <ConfirmPasswordInput name="password" className="signupConfirmPasswordInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
          <div className="signupFormButtonsContainer">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancelOnClick}>Cancel</button>
          </div>
        </form>
      </div>
    </StyledSignUp>
    )
}
export default SignUp;