import { useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { ErrorInput, TextInput, FileInput, SelectInput, ConfirmPasswordInput, ChangePasswordInput } from '../atoms/Inputs';
import inputsDatas from '../../utils/inputsDatas';
import { useContext, useState } from 'react';
import {pagesData} from '../../utils/pagesData';
import { Context } from '../../utils/Context';

const StyledForm = styled.form`
border : solid red 1px;

.buttonsContainer {
  display : flex;
  justify-content : space-around;
}
`

function Form({defaultValues}) {
  const navigate = useNavigate();

  const currentPage = window.location.pathname === "/" ? "welcome" : window.location.pathname.split('/')[1];

  const {setToken} = useContext(Context);

  const inputs = pagesData[currentPage].inputs;

  const inputsInitialValidationStatus = {};
  const inputsInitialData = {};

  for (let input of pagesData[currentPage].inputs) {
      inputsInitialValidationStatus[input] = false;
      inputsInitialData[input] = defaultValues[input];
  }

  const [inputsValidationStatus, setInputsValidationStatus] = useState(inputsInitialValidationStatus);
  
  const [formInputsData, setFormInputsData] = useState(inputsInitialData);

  const handleSubmit = (event) => {
    event.preventDefault();

    const isFormValid = !Object.values(inputsValidationStatus).includes(false);

    if (!isFormValid) {
      alert ("Please fill all inputs");
      return
    } else {
      if (pagesData[currentPage].inputs.includes("confirmPassword") && pagesData[currentPage].inputs.includes("changePassword")) {
        console.log("Don't put confirmPassword and changePassword components on the same form")
        return
      }

      const dataToSend = {};
      const dataToSendKeys = pagesData[currentPage].data.keys;

      for (let key of dataToSendKeys) {
        if (!Object.keys(formInputsData).includes(key)) {
          if (key !== "formerPassword" && key !== "password") {
            console.log("Can't send data")
            return
          } else {
            if (key === "formerPassword" && Object.keys(formInputsData).includes("changePassword")) {
              dataToSend[key] = formInputsData["changePassword"].formerPassword;
            } else if (key === "password" && Object.keys(formInputsData).includes("changePassword")) {
              dataToSend[key] = formInputsData["changePassword"].confirmPassword;
            } else if (key === "password" && Object.keys(formInputsData).includes("confirmPassword")) {
              dataToSend[key] = formInputsData["confirmPassword"];
            } else {
              console.log("Can't send data")
              return
            }
          }
        } else {
          dataToSend[key] = formInputsData[key];
        }
      }

      const postFormData = async function () {
        const formData = new FormData();
        formData.append(pagesData[currentPage].data.formDataTextFieldName, JSON.stringify(dataToSend));
        formData.append("image", event.target.avatar.files[0]);

        try {
          const res = await fetch(pagesData[currentPage].fetchUrl, {
            method : "POST",
            body : formData
          });

          if (res.status === 200 || res.status === 201) {
            if (currentPage === "signUp") {
              const res = await fetch(pagesData["logIn"].fetchUrl, {
                method : "POST",
                headers: { 
                  'Accept': 'application/json', 
                  'Content-Type': 'application/json' 
                  },
                body : JSON.stringify({
                  email : formInputsData["email"],
                  password : formInputsData["confirmPassword"]
                })
              });
              if (res.status === 200 || res.status === 201) {
                const apiData = await res.json();
                setToken(apiData.token);
              }
            }
          } 
          if (res.status === 400 || res.status === 401 || res.status === 403){
            alert ("Wrong request")
          }
          if (res.status === 500){
            alert ("Server error")
          }
        }
        catch {
          console.log("FormData POST request failed.");
        }
      };

      const postJsonData = async function () {
        try {
          const res = await fetch(pagesData[currentPage].fetchUrl, {
            method : "POST",
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json' 
              },
            body : JSON.stringify(dataToSend)
          });

          if (res.status === 200 || res.status === 201) {
            if (currentPage === "logIn") {
              const apiData = await res.json();
              setToken(apiData.token);
            }
            if (currentPage === "signUp") {
              const res = await fetch(pagesData["logIn"].fetchUrl, {
                method : "POST",
                headers: { 
                  'Accept': 'application/json', 
                  'Content-Type': 'application/json' 
                  },
                body : JSON.stringify({
                  email : formInputsData["email"],
                  password : formInputsData["confirmPassword"]
                })
              }); 
              if (res.status === 200 || res.status === 201) {
                const apiData = await res.json();
                setToken(apiData.token);
              }
            }
          }
          if (res.status === 400 || res.status === 401 || res.status === 403){
            alert ("Wrong request")
          }
          if (res.status === 500){
            alert ("Server error")
          }
        }
        catch {
          console.log("JsonData POST request failed.");
        }
      };

      if (Object.keys(formInputsData).includes("avatar") && formInputsData["avatar"] !== undefined) {
        postFormData();
      } else {
        postJsonData();
      }
    }
  };
  
  return (
    <StyledForm onSubmit= {handleSubmit} >
      {
        inputs.map(e => {
          if (!Object.keys(inputsDatas).includes(e)) return <ErrorInput key= {e} className = {currentPage}/>

          if (inputsDatas[e].name === "confirmPassword") return <ConfirmPasswordInput key= {e} name = {e} className = {currentPage} inputsValidationStatus = {inputsValidationStatus} setInputsValidationStatus = {setInputsValidationStatus} formInputsData = {formInputsData} setFormInputsData = {setFormInputsData} />

          if (inputsDatas[e].name === "changePassword") return <ChangePasswordInput key= {e} name = {e} className = {currentPage} inputsValidationStatus = {inputsValidationStatus} setInputsValidationStatus = {setInputsValidationStatus} formInputsData = {formInputsData} setFormInputsData = {setFormInputsData} />

          if (inputsDatas[e].format === "text") return <TextInput key= {e} name = {e} defaultValue = {defaultValues[e]} className = {currentPage} inputsValidationStatus = {inputsValidationStatus} setInputsValidationStatus = {setInputsValidationStatus} formInputsData = {formInputsData} setFormInputsData = {setFormInputsData} />

          if (inputsDatas[e].format === "file") return <FileInput key= {e} name = {e} defaultValue = {defaultValues[e]} className = {currentPage} inputsValidationStatus = {inputsValidationStatus} setInputsValidationStatus = {setInputsValidationStatus} formInputsData = {formInputsData} setFormInputsData = {setFormInputsData} />

          if (inputsDatas[e].format === "select") return <SelectInput key= {e} name = {e} defaultValue = {defaultValues[e]} className = {currentPage} inputsValidationStatus = {inputsValidationStatus} setInputsValidationStatus = {setInputsValidationStatus} formInputsData = {formInputsData} setFormInputsData = {setFormInputsData} />

          else return console.log("Form render problem")
        })
      }
      <div className="buttonsContainer">
        <button type="submit">Submit</button>
        <button onClick={()=> navigate(-1)}>Cancel</button>
      </div>
    </StyledForm>
  );
}

export default Form;