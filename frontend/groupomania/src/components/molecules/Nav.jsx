import styled from "styled-components";
import Button from "../atoms/Button";
import {useContext} from 'react';
import { Context } from "../../utils/Context";

const StyledNav = styled.nav`
position : absolute;
z-index : 1;
right : 0;
top : 0;
margin : 20px;
display : flex;
flex-direction : column;
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
    case "/modifyMyProfile" : navButtons = [logOutButton, homeButton, myProfileButton];
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
  
  return (
    <StyledNav>
    {navButtons.map(e => <Button key={e.key} title = {e.title} link= {e.link} className="isNav" />)}
    </StyledNav>
  );
}

export default Nav;