import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import Button from '../atoms/Button';
import basePath from '../../utils/basePath';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import colors from '../../utils/colors';

const StyledUserProfile = styled.div`
display : flex;
flex-direction : column;
align-items : center;
with : 100%;
height: 100%;

.mainUserProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.userProfileContainer {
  width : 490px;
  border-radius : 20px;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  padding : 20px;
  margin : 20px;
}

.userProfileData {
  color : ${colors.secondary};
}

.userProfileAvatarAndPseudo {
  display : flex;
  align-items : center;
  padding : 5px;
  background-color : #ececf0;
  border-radius : 65px;
  border: outset 3px #ececf0;
}

.userProfileAvatarAndPseudo img {
  height : 120px;
  width : 120px;
  border-radius : 50%;
  object-fit : cover;
}

.userProfileAvatarAndPseudo p {
  color : ${colors.tertiary};
  font-size : 30px;
  margin : 0;
  flex : 1;
  overflow : hidden;
  text-overflow : ellipsis;
  padding-left : 20px;
}

.userProfileDataBlock {
  display : flex;
  padding : 20px 10px 10px 10px;
}

.userProfileDataBlock p {
  word-break : break-all;
}

.userProfileDataBlock div {
  flex : 1;
  padding : 10px;
}

.userProfileActivityContainer {
  display : flex;
  align-items : center;
  padding-left : 30px;
}

.userProfileActivity {
  margin : 0 0 0 20px;
}

.userProfileActivity p {
  margin : 5px 0 5px 0;
}

.userProfileButtons{
  display : flex;
  justify-content : center;
  padding : 40px 20px 20px 20px;
}

.userProfileButton {
  height : 30px;
  width : 120px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  border-width : 2px;
  cursor : pointer;
  margin : 0 20px 0 20px;
}

.userProfileIsPasswordNeeded {
  background-color : white;
  border : outset 3px ${colors.primary};
  border-radius : 20px;
  display : flex;
  flex-direction : column;
  align-items: center;
  margin-top : 30px;
  padding : 20px;
  color : ${colors.tertiary};
}

.userProfileButtonsContainer {
  margin-top : 30px;
}

@media screen and (max-width: 579px) {
  .userProfileContainer {
    width : 80%;
  }

  .userProfileDataBlock {
    flex-direction : column;
  }

  .userProfileDataBlock div {
    padding : 0;
    margin-left : 50px;
  }

  .userProfileActivityContainer {    
    margin-left : 50px;
  }

  .userProfileAvatarAndPseudo img {
    height : 80px;
    width : 80px;
  }
  
  .userProfileAvatarAndPseudo p {
    font-size : 22px;
    flex : 1;
    overflow : hidden;
    text-overflow : ellipsis;
    padding-left : 10px;
  }
  
  .userProfileButton {
    font-size : 14px;
    margin : 0 10px 0 10px;
    width : auto;
  }
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
        <div className="userProfileContainer">
          {profileData !== "none" &&
          <div className="userProfileData">
            <div className="userProfileAvatarAndPseudo" >
              <img src={profileData.imageUrl} alt='Avatar'/>
              <p>{profileData.pseudo}</p>
            </div>
            <div className="userProfileDataBlock">
              <div>
                <p>Email : {profileData.email}</p>
                <p>Status : {profileData.isAdmin ? "admin" : "classic user"}</p>
              </div>
              <div>
                <p>Theme : {profileData.theme}</p>
                <p>Creation : {date}</p>
              </div>
            </div>
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
          <form className="userProfileIsPasswordNeeded" onSubmit={handlePasswordOnSubmit} >
            <div>
              <label htmlFor="userProfilePassword" >Password is needed to delete profile : </label>
              <input id="userProfilePassword" type = "password" autoComplete="off" />
            </div>
            <div className="userProfileButtonsContainer">
              <button className="userProfileButton" type="submit">Validate</button>
              <button onClick={handleCancelDeleteProfileOnClick} className="userProfileButton">Cancel</button>
            </div>
          </form>}
        </div>  
      </div>
    </StyledUserProfile>
    )
}
export default UserProfile;