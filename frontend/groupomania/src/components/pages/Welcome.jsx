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
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.mainWelcomeContainer {
  display : flex;
  flex-direction : column;
  align-items : center;
  margin : 40px 0 40px 0;
}

.mainWelcome h2 {
  color : #46485b;
  font-size : 40px;
  text-shadow : 1px 1px 1px #3f4051;
}

@media screen and (min-width: 400px) and (max-width: 519px) {
  .mainWelcome h2 {
    font-size : 30px;
  }
}

@media screen and (max-width: 399px) {
  .mainWelcome h2 {
    font-size : 24px;
  }
}
`

function Welcome () {
  return (
    <StyledWelcome>
      <Header />
      <div className="mainWelcome">
        <div className="mainWelcomeContainer">
          <h2>Groupomania social network</h2>
          <Button title="Sign up" link= "/signUp" className="isWelcome"/>
          <Button title="Log in" link= "/logIn" className="isWelcome"/>
        </div>
      </div>
    </StyledWelcome>
    )
}
export default Welcome;