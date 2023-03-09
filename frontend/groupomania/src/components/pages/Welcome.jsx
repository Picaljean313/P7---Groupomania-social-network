import React from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';
import Header from '../organisms/Header';

const StyledWelcome = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainWelcome {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  flex : 1;
}
`

function Welcome () {
  return (
    <StyledWelcome>
      <Header />
      <div className="mainWelcome">
        <h2>Groupomania social network</h2>
        <Button title="Sign up" link= "/signUp" className="isWelcome"/>
        <Button title="Log in" link= "/logIn" className="isWelcome"/>
      </div>
    </StyledWelcome>
    )
}
export default Welcome;