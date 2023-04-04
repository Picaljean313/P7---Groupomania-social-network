import { useContext } from 'react';
import {createGlobalStyle} from 'styled-components';
import { Context } from './Context';
import {themes} from './themes';

const StyledGlobalStyle = createGlobalStyle`
body {
  margin : 0;
  padding : 0;
  font-family: Lato, Sans-Serif;
}

#root {
  background : ${props => props.theme.background};
  background-size: cover;
  background-position : center;
  font-size: 16px;
  display : flex;
  flex-direction : column;
  height : 100vh;
}
`

function GlobalStyle () {
  const {theme} = useContext (Context);
  return <StyledGlobalStyle theme={themes[theme]}/>
}

export default GlobalStyle;