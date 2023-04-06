import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { FileInput, TextInput, SelectInput, ConfirmPasswordInput } from '../atoms/Inputs';
import basePath from '../../utils/basePath';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { Context } from '../../utils/Context';
import colors from '../../utils/colors';


const StyledCreateUser = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainCreateUser {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.createUserForm {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 20px;
  margin : 40px 0 40px 0;
  padding : 20px 0 10px 0;
  width :490px;
}

.createUserTextInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.createUserTextInput label {
  width : 140px;
  font-size : 20px;
}

.createUserTextInput input {
  flex:1;
  font-size : 16px;
  color : ${colors.tertiary};
}

.createUserSelectInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.createUserSelectInput label {
  width : 140px;
  font-size : 20px;
}

.createUserSelectInput select {
  flex : 1;
  font-size : 16px;
  text-align : center;
}

.createUserFileInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.createUserFileInput label {
  width : 140px;
  font-size : 20px;
}

.createUserFileInput input {
  flex : 1;
  font-size : 16px;
}

.createUserConfirmPasswordInput {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 15px;
}

.createUserConfirmPasswordInput label {
  width : 140px;
  font-size : 20px;
}

.createUserConfirmPasswordInput input {
  width : 300px;
  font-size : 16px;
  color : ${colors.tertiary};
}

.createUserFormButtonsContainer {
  display : flex;
}

.createUserFormButtonsContainer button {
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
  .createUserForm {
    width :90%;
  }
  
  .createUserTextInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .createUserTextInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .createUserTextInput input {
    width : 272px;
    font-size : 14px;
  }
  
  .createUserSelectInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .createUserSelectInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .createUserSelectInput select {
    width : 280px;
    font-size : 14px;
  }
  
  .createUserFileInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .createUserFileInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .createUserFileInput input {
    width : 280px;
    font-size : 14px;
  }
  
  .createUserConfirmPasswordInput {
    flex-direction : column;
    justify-content : center;
  }
  
  .createUserConfirmPasswordInput label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .createUserConfirmPasswordInput input {
    width : 272px;
    font-size : 14px;
  }
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
          window.location.reload();
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
          window.location.reload();
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
          <form className="createUserForm" onSubmit={handleOnSubmit} >
            <TextInput name="pseudo" defaultValue="" className="createUserTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <FileInput name="avatar" defaultValue={undefined} className="createUserFileInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="theme" defaultValue="" className="createUserSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <TextInput name="email" defaultValue="" className="createUserTextInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <SelectInput name="isAdmin" defaultValue="" className="createUserSelectInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <ConfirmPasswordInput name="password" className="createUserConfirmPasswordInput" inputsValidationStatus={inputsValidationStatus} setInputsValidationStatus={setInputsValidationStatus} formInputsData={formInputsData} setFormInputsData={setFormInputsData} />
            <div className="createUserFormButtonsContainer">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCancelOnClick}>Cancel</button>
            </div>
          </form>
        </div>
      </StyledCreateUser>
      )
}
export default CreateUser;