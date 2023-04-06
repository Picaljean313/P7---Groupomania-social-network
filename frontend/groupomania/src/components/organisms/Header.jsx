import Nav from '../molecules/Nav';
import Informations from '../atoms/Informations';
import styled from 'styled-components';
import colors from '../../utils/colors';

const StyledHeader = styled.div`
  position : relative;
  height: 110px;
  width : 100%;

  .headerTitle {
    display : flex;
    align-items : center;
    justify-content : center;
    height : 110px;
  }

  h1 {
    margin : 0;
    color : ${colors.primary};
    font-size : 50px;
    text-shadow : 2px 2px 2px #ca2400;
  }

@media screen and (max-width : 850px) {
  height: 220px;

  .headerTitle {
    margin-top : 110px;
  }
}
`

function Header() {

  let title;
  
  switch(window.location.pathname){
    case "/" : title = "Welcome"; break;
    case "/signUp" : title = "Sign up"; break;
    case "/logIn" : title = "Log in"; break;
    case "/home" : title = "Home"; break;
    case "/myProfile" : title = "My profile"; break;
    case "/modifyMyProfile" : title = "Modify my profile"; break;
    case "/createUser" : title = "Create new user"; break;
    case "/allProfiles" : title = "All profiles"; break;
    case "/allPosts" : title = "All posts"; break;
    case "/allComments" : title = "All comments"; break;
    case "/allReports" : title = "All reports"; break;
    default : title = "Undefined";
  }

  if (/^\/userProfile\/\S+/.test(window.location.pathname)){
    title = "User profile";
  }

  if (/^\/modifyProfile\/\S+/.test(window.location.pathname)){
    title = "Modify profile";
  }

  return (
    <StyledHeader>
      <Informations />
      <div className="headerTitle" >
        <h1>{title}</h1>
      </div>
      <Nav />
    </StyledHeader>
  );
}

export default Header;