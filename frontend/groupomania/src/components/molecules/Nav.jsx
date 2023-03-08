import styled from "styled-components";
import Button from "../atoms/Button";

const StyledNav = styled.nav`
width : 200px;
padding-top : 20px;
`

function Nav() {
  let navButtons;
  
  const welcomeButton = {key : "welcome", title : "Welcome", link : "/"};
  const logOutButton = {key : "logOut", title : "Log out", link : "/"}; 
  const homeButton = {key : "home", title : "Home", link : "/home"}; 
  const myProfileButton = {key : "myProfile", title : "My profile", link : "/myProfile"}; 

  // if (/^\/profile\/\S+/.test(window.location.pathname)){
  //   buttons = 
  // }

  switch(window.location.pathname){
    case "/" : navButtons = []; break;
    case "/signUp" : navButtons = [welcomeButton]; break;
    case "/logIn" : navButtons = [welcomeButton]; break;
    case "/home" : navButtons = [logOutButton, myProfileButton]; break;
    case "/myProfile" : navButtons = [logOutButton, homeButton]; break;
    default : navButtons = [];
  }
  
  return (
    <StyledNav>
    {navButtons.map(e => <Button key={e.key} title = {e.title} link= {e.link} className="isNav" />)}
    </StyledNav>
  );
}

export default Nav;