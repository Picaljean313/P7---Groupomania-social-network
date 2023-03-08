import React from 'react';
import Form  from '../organisms/Form';
import styled from 'styled-components';
import Header from '../organisms/Header';

const StyledSignUp = styled.div`
display: flex;
flex-direction: column;
justify-content : center;
align-items : center;
flex : 1;
`

function SignUp () {

  const defaultValues = {
    pseudo : "", 
    avatar : undefined,
    theme : "original",
    email : "",
    confirmPassword : "",
    changePassword : {
      formerPassword : "",
      confirmPassword : ""
    }
  };

  return (
    <React.Fragment>
      <Header />
      <StyledSignUp>
        <Form defaultValues = {defaultValues} />
      </StyledSignUp>
    </React.Fragment>
    )
}
export default SignUp;