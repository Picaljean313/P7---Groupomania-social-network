import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import Button from '../atoms/Button';
import basePath from '../../utils/basePath';
import { useEffect } from 'react';

const StyledUserProfile = styled.div`
display : flex;
flex-direction : column;
align-items : center;

.mainUserProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
}

.profileUserAvatarAndPseudo {
  display : flex;
  align-items : center;
  margin-top : 50px;
}

.profileUserAvatarAndPseudo img {
height : 120px;
width : 120px;
border-radius : 50%;
object-fit : cover;
margin : 0 20px 0 0;
}

.profileUserAvatarAndPseudo p {
font-size : 40px;
margin : 0 0 0 20px;
}

.profileUserActivityContainer {
  display : flex;
}

.profileUserActivity {
  margin : 0 0 0 30px;
}

.profileUserActivity p {
  margin : 0;
}

.profileUserButton {
  margin : 20px;
}

.profileUserCancelButton {
  margin : 0 0 0 30px;
}

.isPasswordNeeded {
  margin : 20px;
}
`

function UserProfile () {
  const {isAdmin, userData, token } = useContext(Context);

  const [userProfileData, setUserProfileData] = useState("none");

  const userId = window.location.pathname.split("userProfile/")[1];

  let date;
  try {
    const day = parseInt(userProfileData.creationDate.split('T')[0].split('-')[2]).toString();

    const monthNumber = parseInt(userProfileData.creationDate.split('T')[0].split('-')[1]).toString();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[monthNumber - 1];

    const year = userProfileData.creationDate.split('T')[0].split('-')[0];

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
      const apiUserProfileData = await res.json();

      return setUserProfileData(apiUserProfileData);
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
        password : document.getElementById("profileUserPassword").value
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
        alert ("Profile is deleted")
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
        {userProfileData !== "none" &&
        <div className="profileUserData">
          <div className="profileUserAvatarAndPseudo" >
            <img src={userProfileData.imageUrl} alt='Avatar'/>
            <p>{userProfileData.pseudo}</p>
          </div>
          <p>Email : {userProfileData.email}</p>
          <p>Theme : {userProfileData.theme}</p>
          <p>Status : {userProfileData.isAdmin ? "admin" : "classic user"}</p>
          <p>Creation date : {date}</p>
          <div className="profileUserActivityContainer">
            <p>Activity :</p>
            {userProfileData.activity !== undefined &&
            <div className="profileUserActivity">
              <p>Posts : {userProfileData.activity.posts}</p>
              <p>Comments : {userProfileData.activity.comments}</p>
              <p>Reactions : {userProfileData.activity.reactions}</p>
            </div>}
          </div>
        </div>}
        {userProfileData === "none" && 
        <p>There is no profile associated to that ID</p>}
        {!isPasswordNeeded && isAdmin && userProfileData !== "none" &&
        <div className="profileUserButtons" >
          <Button title = "Modify profile" link= {`/modifyProfile/${userId}`} className="profileUserButton" />
          <button onClick={handleDeleteProfileOnClick} className="profileUserButton" >Delete profile</button>
        </div>}
        {isPasswordNeeded && isAdmin && 
        <div className="isPasswordNeeded" >
          <form onSubmit={handlePasswordOnSubmit} >
            <div>
              <label htmlFor="profileUserPassword" >Password is needed to delete profile : </label>
              <input id="profileUserPassword" type = "password" autoComplete="off" />
            </div>
            <button type="submit">Validate</button>
            <button onClick={handleCancelDeleteProfileOnClick} className="profileUserCancelButton">Cancel</button>
          </form>
        </div>}
      </div>
    </StyledUserProfile>
    )
}
export default UserProfile;