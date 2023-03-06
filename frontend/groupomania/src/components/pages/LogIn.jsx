import React from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import Form from '../organisms/Form';

const StyledLogIn = styled.div`
display: flex;
flex-direction: column;
justify-content : center;
align-items : center;
flex : 1;
`

function LogIn () {

  const defaultValues = {
    email : "",
    password : ""
  };

  return (
    <React.Fragment>
      <Header />
      <StyledLogIn>
        <Form defaultValues = {defaultValues} />
      </StyledLogIn>
    </React.Fragment>
    )
}
export default LogIn;