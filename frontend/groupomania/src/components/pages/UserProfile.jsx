import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import Button from '../atoms/Button';
import basePath from '../../utils/basePath';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';

const StyledUserProfile = styled.div`
display : flex;
flex-direction : column;
align-items : center;

.mainUserProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
}

.userProfileAvatarAndPseudo {
  display : flex;
  align-items : center;
  margin-top : 50px;
}

.userProfileAvatarAndPseudo img {
height : 120px;
width : 120px;
border-radius : 50%;
object-fit : cover;
margin : 0 20px 0 0;
}

.userProfileAvatarAndPseudo p {
font-size : 40px;
margin : 0 0 0 20px;
}

.userProfileActivityContainer {
  display : flex;
}

.userProfileActivity {
  margin : 0 0 0 30px;
}

.userProfileActivity p {
  margin : 0;
}

.userProfileButton {
  margin : 20px;
}

.userProfileCancelButton {
  margin : 0 0 0 30px;
}

.isPasswordNeeded {
  margin : 20px;
}
`

function UserProfile () {
  const {isAdmin, userData, token, profileData, setProfileData } = useContext(Context);
  const navigate = useNavigate();

  const userId = window.location.pathname.split("userProfile/")[1];

  let date;
  try {
    const day = parseInt(profileData.creationDate.split('T')[0].split('-')[2]).toString();

    const monthNumber = parseInt(profileData.creationDate.split('T')[0].split('-')[1]).toString();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[monthNumber - 1];

    const year = profileData.creationDate.split('T')[0].split('-')[0];

    date = `${day} ${month} ${year}`;
  } catch {
    date = "Can't get date"
  }
  
  const [isPasswordNeeded, setIsPasswordNeeded] = useState(false);

  const getUserData = async function () {
    const res = await fetch(`${basePath}/users/${userId}?activity=true`, {
      method : "GET",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
  
    if (res.status === 200) {
      const apiProfileData = await res.json();
      sessionStorage.setItem("GroupomaniaProfileData", JSON.stringify(apiProfileData));

      return setProfileData(apiProfileData);
    } else {
      return console.log("Fail")
    }
  };

  useEffect(()=> {
    getUserData();
  }, []);


  const handleDeleteProfileOnClick = () => {
    setIsPasswordNeeded(true);
  };

  const handleCancelDeleteProfileOnClick = () => {
    setIsPasswordNeeded(false);
  };

  const handlePasswordOnSubmit = async function (event) {
    event.preventDefault();

    const res = await fetch(`${basePath}/users/logIn`,{
      method : "POST",
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
      body : JSON.stringify({
        email : userData.email,
        password : document.getElementById("userProfilePassword").value
      })
    });
    if (res.status === 200){
      const res = await fetch(`${basePath}/users/${userId}`,{
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        alert ("Profile is deleted");
        sessionStorage.removeItem("GroupomaniaProfileData");
        return navigate(-1);
      }
      else {
        console.log("Can't delete profile")
      }
    } 
    else {
      console.log("Password issue")
    }
  };

  return (
    <StyledUserProfile>
      <Header />
      <div className="mainUserProfile">
        {profileData !== "none" &&
        <div className="userProfileData">
          <div className="userProfileAvatarAndPseudo" >
            <img src={profileData.imageUrl} alt='Avatar'/>
            <p>{profileData.pseudo}</p>
          </div>
          <p>Email : {profileData.email}</p>
          <p>Theme : {profileData.theme}</p>
          <p>Status : {profileData.isAdmin ? "admin" : "classic user"}</p>
          <p>Creation date : {date}</p>
          <div className="userProfileActivityContainer">
            <p>Activity :</p>
            {profileData.activity !== undefined &&
            <div className="userProfileActivity">
              <p>Posts : {profileData.activity.posts}</p>
              <p>Comments : {profileData.activity.comments}</p>
              <p>Reactions : {profileData.activity.reactions}</p>
            </div>}
          </div>
        </div>}
        {profileData === "none" && 
        <p>There is no profile associated to that ID</p>}
        {!isPasswordNeeded && isAdmin && profileData !== "none" &&
        <div className="userProfileButtons" >
          <Button title = "Modify profile" link= {`/modifyProfile/${userId}`} className="userProfileButton" />
          <button onClick={handleDeleteProfileOnClick} className="userProfileButton" >Delete profile</button>
        </div>}
        {isPasswordNeeded && isAdmin && 
        <div className="isPasswordNeeded" >
          <form onSubmit={handlePasswordOnSubmit} >
            <div>
              <label htmlFor="userProfilePassword" >Password is needed to delete profile : </label>
              <input id="userProfilePassword" type = "password" autoComplete="off" />
            </div>
            <button type="submit">Validate</button>
            <button onClick={handleCancelDeleteProfileOnClick} className="userProfileCancelButton">Cancel</button>
          </form>
        </div>}
      </div>
    </StyledUserProfile>
    )
}
export default UserProfile;