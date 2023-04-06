import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import Button from '../atoms/Button';
import basePath from '../../utils/basePath';
import colors from '../../utils/colors';

const StyledMyProfile = styled.div`
display : flex;
flex-direction : column;
align-items : center;
with : 100%;
height: 100%;

.mainMyProfile {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.myProfileContainer {
  width : 490px;
  border-radius : 20px;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  padding : 20px;
  margin : 20px;
}

.myProfileData {
  color : ${colors.secondary};
}

.myProfileAvatarAndPseudo {
  display : flex;
  align-items : center;
  padding : 5px;
  background-color : #ececf0;
  border-radius : 65px;
  border: outset 3px #ececf0;
}

.myProfileAvatarAndPseudo img {
  height : 120px;
  width : 120px;
  border-radius : 50%;
  object-fit : cover;
}

.myProfileAvatarAndPseudo p {
  color : ${colors.tertiary};
  font-size : 30px;
  margin : 0;
  flex : 1;
  overflow : hidden;
  text-overflow : ellipsis;
  padding-left : 20px;
}

.myProfileDataBlock {
  display : flex;
  padding : 20px 10px 10px 10px;
}

.myProfileDataBlock p {
  word-break : break-all;
}

.myProfileDataBlock div {
  flex : 1;
  padding : 10px;
}

.myProfileActivityContainer {
  display : flex;
  align-items : center;
  padding-left : 30px;
}

.myProfileActivity {
  margin : 0 0 0 20px;
}

.myProfileActivity p {
  margin : 5px 0 5px 0;
}

.myProfileButtons{
  display : flex;
  justify-content : center;
  padding : 40px 20px 20px 20px;
}

.myProfileButton {
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

.myProfileIsPasswordNeeded {
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

.myProfileButtonsContainer {
  margin-top : 30px;
}

@media screen and (max-width: 579px) {
  .myProfileContainer {
    width : 80%;
  }

  .myProfileDataBlock {
    flex-direction : column;
  }

  .myProfileDataBlock div {
    padding : 0;
    margin-left : 50px;
  }

  .myProfileActivityContainer {    
    margin-left : 50px;
  }

  .myProfileAvatarAndPseudo img {
    height : 80px;
    width : 80px;
  }
  
  .myProfileAvatarAndPseudo p {
    font-size : 22px;
    flex : 1;
    overflow : hidden;
    text-overflow : ellipsis;
    padding-left : 10px;
  }
  
  .myProfileButton {
    font-size : 14px;
    margin : 0 10px 0 10px;
    width : auto;
  }
}
`

function MyProfile () {
  const {userData, token, setToken} = useContext(Context);

  let date;
  try {
    const day = parseInt(userData.creationDate.split('T')[0].split('-')[2]).toString();

    const monthNumber = parseInt(userData.creationDate.split('T')[0].split('-')[1]).toString();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[monthNumber - 1];

    const year = userData.creationDate.split('T')[0].split('-')[0];

    date = `${day} ${month} ${year}`;
  } catch {
    console.log("Can't get date")
  }

  const [userActivity, setUserActivity] = useState(userData.activity);

  const getUserActivity = async function () {
    const res = await fetch (`${basePath}/users/me?activity=true`,{
      method : "GET",
      headers: { 
        'Authorization' : `Bearer ${token}`
        }
    });
    if (res.status === 200) {
      const resJson = await res.json();
      const resActivity = resJson.activity;
      if (resActivity.posts !== userData["activity"].posts || resActivity.comments !== userData["activity"].comments || resActivity.reactions !== userData["activity"].reactions) {
        return setUserActivity(resActivity);
      }
      else return
    }
    else return console.log("Get user activity failed")
  };
  useEffect(()=> {
    getUserActivity();
  },[]);
  
  const [isPasswordNeeded, setIsPasswordNeeded] = useState(false);

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
        password : document.getElementById("myProfilePassword").value
      })
    });
    if (res.status === 200){
      const res = await fetch(`${basePath}/users/${userData._id}`,{
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        sessionStorage.removeItem("GroupomaniaUserData");
        sessionStorage.removeItem("GroupomaniaSessionToken");
        setToken("none");
        alert ("Your profile is deleted")
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
    <StyledMyProfile>
      <Header />
      <div className="mainMyProfile">
        <div className="myProfileContainer">
          <div className="myProfileData">
            <div className="myProfileAvatarAndPseudo" >
              <img src={userData.imageUrl} alt='Avatar'/>
              <p>{userData.pseudo}</p>
            </div>
            <div className="myProfileDataBlock">
              <div>
                <p>Email : {userData.email}</p>
                <p>Status : {userData.isAdmin ? "admin" : "classic user"}</p>
              </div>
              <div>
                <p>Theme : {userData.theme}</p>
                <p>Creation : {date}</p>
              </div>
            </div>
            <div className="myProfileActivityContainer">
              <p>Activity :</p>
              <div className="myProfileActivity">
                <p>Posts : {userActivity.posts}</p>
                <p>Comments : {userActivity.comments}</p>
                <p>Reactions : {userActivity.reactions}</p>
              </div>
            </div>
          </div>
          {!isPasswordNeeded &&
          <div className="myProfileButtons" >
            <Button title = "Modify profile" link="/modifyMyProfile" className="myProfileButton" />
            <button onClick={handleDeleteProfileOnClick} className="myProfileButton" >Delete profile</button>
          </div>}
          {isPasswordNeeded && 
          <form className="myProfileIsPasswordNeeded" onSubmit={handlePasswordOnSubmit} >
            <div>
              <label htmlFor="myProfilePassword" >Password is needed to delete profile : </label>
              <input id="myProfilePassword" type = "password" autoComplete="off" />
            </div>
            <div className="myProfileButtonsContainer">
              <button className="myProfileButton" type="submit">Validate</button>
              <button onClick={handleCancelDeleteProfileOnClick} className="myProfileButton">Cancel</button>
            </div>
          </form>}
        </div>
      </div>
    </StyledMyProfile>
    )
}
export default MyProfile;