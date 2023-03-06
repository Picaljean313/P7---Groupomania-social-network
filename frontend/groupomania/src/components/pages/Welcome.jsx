import React from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';
import Header from '../organisms/Header';

const StyledWelcome = styled.div`
display: flex;
flex-direction: column;
justify-content : center;
align-items : center;
flex : 1;
`

function Welcome () {
  return (
    <React.Fragment>
      <Header />
      <StyledWelcome>
        <h2>Groupomania social network</h2>
        <Button title="Sign up" link= "signUp" className="isWelcome"/>
        <Button title="Log in" link= "logIn" className="isWelcome"/>
      </StyledWelcome>
    </React.Fragment>
    )
}
export default Welcome;