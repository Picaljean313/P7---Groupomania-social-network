import Nav from '../molecules/Nav';
import Informations from '../atoms/Informations';
import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100px;
  width : 100%;
`

function Header() {

  let title;

  // if (/^\/profile\/\S+/.test(window.location.pathname)){
  //   title = "User Profile";
  // }
  
  switch(window.location.pathname){
    case "/" : title = "Welcome"; break;
    case "/signUp" : title = "Sign up"; break;
    case "/logIn" : title = "Log in"; break;
    case "/home" : title = "Home"; break;
    case "/myProfile" : title = "My profile"; break;
    case "/modifyMyProfile" : title = "Modify my profile"; break;
    default : title = "Undefined";
  }

  return (
    <StyledHeader>
      <Informations />
      <h1>{title}</h1>
      <Nav />
    </StyledHeader>
  );
}

export default Header;