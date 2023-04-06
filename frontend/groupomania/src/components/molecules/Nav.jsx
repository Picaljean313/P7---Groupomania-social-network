import styled from "styled-components";
import Button from "../atoms/Button";
import {useContext} from 'react';
import { Context } from "../../utils/Context";
import { useState } from "react";
import colors from "../../utils/colors";

const StyledNav = styled.nav`
position : absolute;
z-index : 1;
right : 0;
top : 0;
margin : 10px 20px 10px 10px;
display : flex;
flex-direction : column;

.navigation {
  display : none;
  position : relative;
  height : 90px;
  width : 110px;
  justify-content : center;
  border-radius : 20px;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  color : ${colors.secondary};
}

.navOpenButton {
  display : none;
  width : 30px;
  height : 30px;
  border-radius : 50%;
  background-color : white;
  border : outset 2px white;
}
  
.navOpenButton p {
  margin : 0;
  color : ${colors.primary};
  font-size : 24px;
  cursor : pointer;
}

@media screen and (max-width : 849px) {
  ${props => props.isNavOpen ? `
  .navButtonsContainer {
    display : flex;
    flex-direction : column;
    align-items : center;
    padding : 10px 10px 20px 10px;
    border-radius : 20px;
    background-color : #ececf0;
    box-shadow : 10px 5px 2px #46485b;
    border : outset 2px ${colors.tertiary};
  }
  
  .navOpenButton {
    display : flex;
    align-items : center;
    justify-content : center;
    position : absolute;
    bottom : -17px;
    left : 53px;
    border-color : ${colors.tertiary};
  }
  ` : `
  .navigation {
    display : flex;
    flex-direction: column;
    align-items : center;
  }

  .navButtonsContainer {
    display : none;
  }
  
  .navOpenButton {
    display : flex;
    align-items : center;
    justify-content : center;
    position : absolute;
    bottom : -17px;
    left : 43px;
  }
  `}
}

@media screen and (min-width : 600px) and (max-width : 849px) {
  right : 105px;
}

@media screen and (max-width : 599px) {
  
}
`

function Nav() {
  const {userData} = useContext(Context);
  let navButtons;
  
  const welcomeButton = {key : "welcome", title : "Welcome", link : "/"};
  const logOutButton = {key : "logOut", title : "Log out", link : "/"}; 
  const homeButton = {key : "home", title : "Home", link : "/home"}; 
  const myProfileButton = {key : "myProfile", title : "My profile", link : "/myProfile"}; 
  const createUserButton = {key : "createUser", title : "Create user", link : "/createUser"}; 
  const viewAllProfilesButton = {key : "viewAllProfiles", title : "All Profiles", link : "/allProfiles"}; 
  const viewAllPostsButton = {key : "viewAllPosts", title : "All posts", link : "/allPosts"}; 
  const viewAllCommentsButton = {key : "viewAllComments", title : "All comments", link : "/allComments"}; 
  const viewAllReportsButton = {key : "viewAllReports", title : "All reports", link : "/allReports"}; 
  const backButton = {key : "back", title : "Back", link : ""}; 

  switch(window.location.pathname){
    case "/" : navButtons = []; break;
    case "/signUp" : navButtons = [welcomeButton]; break;
    case "/logIn" : navButtons = [welcomeButton]; break;
    case "/home" : navButtons = [logOutButton, myProfileButton]; break;
    case "/myProfile" : navButtons = [logOutButton, homeButton]; break;
    case "/modifyMyProfile" : navButtons = [logOutButton, homeButton, myProfileButton]; break;
    case "/createUser" : navButtons = [logOutButton, homeButton];  break;
    case "/allProfiles" : navButtons = [logOutButton, homeButton];  break;
    case "/allPosts" : navButtons = [logOutButton, homeButton];  break;
    case "/allComments" : navButtons = [logOutButton, homeButton];  break;
    case "/allReports" : navButtons = [logOutButton, homeButton];  break;
    default : navButtons = [];
  }

  if (/^\/userProfile\/\S+/.test(window.location.pathname)){
    navButtons = [logOutButton, homeButton, backButton];
  };

  if (/^\/modifyProfile\/\S+/.test(window.location.pathname)){
    navButtons = [logOutButton, homeButton, backButton];
  };

  if (window.location.pathname === "/home" && userData.isAdmin){
    navButtons.push(createUserButton, viewAllProfilesButton, viewAllPostsButton, viewAllCommentsButton, viewAllReportsButton);
  }

  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavOpenButtonOnClick = () => {
    if (isNavOpen === true){
      setIsNavOpen(false);
    }
    else {
      setIsNavOpen(true);
    }
  };
  
  return (
    <StyledNav isNavOpen={isNavOpen} >
      <div className="navigation">
        <p>Navigation</p>
      </div>
      <div className="navButtonsContainer">
        {navButtons.map(e => <Button key={e.key} title = {e.title} link= {e.link} className="isNav" />)}
      </div>
      <div className="navOpenButton" onClick={handleNavOpenButtonOnClick} >
        <p>{isNavOpen ? "-" : "+"}</p>
      </div>
    </StyledNav>
  );
}

export default Nav;