import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import Button from '../atoms/Button';
import { basePath } from '../../utils/pagesData';

const StyledProfile = styled.div`
display : flex;
flex-direction : column;
align-items : center;

.mainProfilePage {
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

function Profile ({userProfile}) {
  const {userData, token, setToken} = useContext(Context);

  let user;
  if (userProfile !== undefined){
    user = userProfile;
  } else {
    if (userData === "none"){
      user = JSON.parse(sessionStorage.getItem("GroupomaniaUserData"));
    } else {
      user = userData;
    }
  }

  let date;
  try {
    const day = parseInt(user.creationDate.split('T')[0].split('-')[2]).toString();

    const monthNumber = parseInt(user.creationDate.split('T')[0].split('-')[1]).toString();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[monthNumber - 1];

    const year = user.creationDate.split('T')[0].split('-')[0];

    date = `${day} ${month} ${year}`;
  } catch {
    console.log("Can't get date")
  }
  
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
        password : document.getElementById("profileUserPassword").value
      })
    });
    if (res.status === 200){
      const res = await fetch(`${basePath}/users/${user._id}`,{
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200){
        if (userData._id === user._id){
          sessionStorage.removeItem("GroupomaniaUserData");
          sessionStorage.removeItem("GroupomaniaSessionToken");
          setToken("none");
        }
        alert ("User is deleted")
      }
      else {
        console.log("Can't delete user")
      }
    } 
    else {
      console.log("Password issue")
    }
  };

  return (
    <StyledProfile>
      <Header />
      <div className="mainProfilePage">
        <div className="profileUserData">
          <div className="profileUserAvatarAndPseudo" >
            <img src={user.imageUrl} alt='Avatar'/>
            <p>{user.pseudo}</p>
          </div>
          <p>Email : {user.email}</p>
          <p>Theme : {user.theme}</p>
          <p>Status : {user.isAdmin ? "admin" : "classic user"}</p>
          <p>Creation date : {date}</p>
          <div className="profileUserActivityContainer">
            <p>Activity :</p>
            <div className="profileUserActivity">
              <p>Posts : {user.activity.posts}</p>
              <p>Comments : {user.activity.comments}</p>
              <p>Reactions : {user.activity.reactions}</p>
            </div>
          </div>
        </div>
        {(user === userData || user.isAdmin === true) && !isPasswordNeeded &&
        <div className="profileUserButtons" >
          <Button title = "Modify profile" link="modifyProfile" className="profileUserButton" />
          <button onClick={handleDeleteProfileOnClick} className="profileUserButton" >Delete profile</button>
        </div>}
        {isPasswordNeeded && 
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
    </StyledProfile>
    )
}
export default Profile;