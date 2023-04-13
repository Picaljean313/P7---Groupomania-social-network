import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import basePath from '../../utils/basePath';
import Post from '../molecules/Post';
import Header from '../organisms/Header';
import colors from '../../utils/colors';

const StyledHome = styled.div`
display: flex;
flex-direction: column;
align-items : center;
position : relative;
width : 100%;
height: 100%;

.mainHome {
  overflow : scroll;
  width : 100%;
  flex : 1;
  display : flex;
  flex-direction : column;
  align-items : center;
}

.mainRefreshButton {
  position : absolute;
  left : 45px;
  top : 200px;
  height : 60px;
  width : 140px;
  border-radius : 10px;
  background-color :  white;
  font-size : 18px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  border-width : 3px;
  cursor : pointer;
}

.mainRefreshButton830-1000 {
  display : none;
}

.mainRefreshButton829 {
  display : none;
}

.homePageButtonsContainer {
  display : flex;
  justify-content : center;
}

.homePageButton {
  height : 40px;
  width : 160px;
  margin : 40px 5px 40px 5px;
  border-radius : 10px;
  background-color :  white;
  font-size : 18px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  border-width : 3px;
  cursor : pointer;
}

.mainHomeForm {
  display : flex;
  flex-direction: column;
  justify-content : center;
  align-items : center;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  padding : 10px;
  border-radius : 20px;
  margin-top : 20px;
}

.newPostContent {
  display : flex;
  align-items : center;
  margin : 10px;
  width : 450px;
  height : 60px;
}

.newPostContent label {
  width : 140px;
  font-size : 18px;
  color : ${colors.secondary};
}

.newPostContent textarea {
  display : block;
  flex :1;
  max-height : 80px;
  font-size : 18px;
  color : ${colors.tertiary};
}

.newPostImage {
  display : flex;
  align-items : center;
  width : 450px;
  margin : 10px;
}

.newPostImage label {
  display : block;
  width : 130px;
  font-size : 18px;
  color : ${colors.secondary};
}

.newPostImage input {
  width : 300px;
  margin-left : 15px;
  font-size : 16px;
  color : ${colors.secondary};
}

.newPostImage input::file-selector-button {
  cursor : pointer;
  color : ${colors.tertiary};
}

.mainHomeForm button {
  height : 30px;
  border-radius : 10px;
  width : 80px;
  margin : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

.homePageNoPosts {
  margin : 40px 0 40px 0;
  width : 490px;
  height : 70px;
  background-color : ${colors.tertiary};
  box-shadow : 10px 5px 2px #46485b;
  border-radius : 25px;
  display : flex;
  flex-direction : column;
  align-items: center;
  justify-content : center;
}

.homePageNoPosts p {
  color : ${colors.secondary};
  font-size : 20px;
  margin : 0;
}

@media screen and (min-width: 830px) and (max-width: 1000px) {
  .mainRefreshButton {
    display : none;
  }

  .mainRefreshButton830-1000 {
    display : block;
    position : absolute;
    left : 25px;
    top : 200px;
    height : 60px;
    width : 120px;
    border-radius : 10px;
    background-color :  white;
    font-size : 18px;
    color : ${colors.primary};
    border-color : ${colors.primary}; 
    border-width : 3px;
    cursor : pointer;
  }
}

@media screen and (min-width: 520px) and (max-width: 829px) {
  .homePosts {
    align-items : center;
  }

  .mainRefreshButton830-1000 {
    display : none;
  }

  .mainRefreshButton {
    display : none;
  }

  .mainRefreshButton829 {
    display : block;
  }
}

@media screen and (max-width: 519px) {
  .mainRefreshButton {
    display : none;
  }

  .mainHomeForm {
    width : 80%;
  }

  .newPostContent {
    flex-direction : column;
    justify-content : center;
    height : 100px;
  }
  
  .newPostContent label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .newPostContent textarea {
    flex : none;
    max-height : 80px;
    max-width : 280px;
    font-size : 14px;
  }

  .newPostImage {
    flex-direction : column;
    justify-content : center;
  }
  
  .newPostImage label {
    font-size : 16px;
    margin-bottom : 10px;
  }
  
  .newPostImage input {
    font-size : 14px;
  }

  .homePageButton {
    height : 35px;
    width : 140px;
    font-size : 16px;
  }

  .homePageButtonsContainer {
    flex-direction : column;
    align-items : center;
  }

  .mainRefreshButton829 {
    display : block;
    margin : 0 0 40px 0;
  }

  .homePosts {
    width : 80%;
  }
}
`

function Home () {
  sessionStorage.removeItem("GroupomaniaProfileData");
  
  const {token} = useContext(Context);

  const [homePosts, setHomePosts] = useState("none");
  const [isMorePostsToShow, setIsMorePostsToShow] = useState(false);

  const limit = 2;

  const getInitialHomePagePosts = async function () {
    const fetchLimit = limit + 1;
    try {
      const res = await fetch(`${basePath}/posts?limit=${fetchLimit}&sort=desc&reactions=true&comments=true&commentsReactions=true&userData=true&commentsUserData=true`,{
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.length === fetchLimit){
          data.splice(data.length - 1, 1);
          setIsMorePostsToShow(true);
        }
        setHomePosts(data);
      }
    }
    catch {
      console.log("Can't get posts");
    }
  };

  const getMoreHomePagePosts = async function () {
    let maxDate;
    if (homePosts.length !== 0){
      maxDate = homePosts[homePosts.length - 1].creationDate;
    }
    const fetchLimit = limit + 2;
    try {
      const res = await fetch(`${basePath}/posts?limit=${fetchLimit}&sort=desc&reactions=true&comments=true&commentsReactions=true&userData=true&commentsUserData=true&maxDate=${maxDate}`,{
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const data = await res.json();

        const newIsMorePostsToShow = data.length === fetchLimit;
        if (newIsMorePostsToShow !== isMorePostsToShow){
          setIsMorePostsToShow(newIsMorePostsToShow);
        }

        if (newIsMorePostsToShow){
          data.splice(data.length - 1, 1);
        }
        data.splice(0,1);
    
        const newHomePosts = [];
        if (data.length !==0 && Array.isArray(homePosts) && homePosts.length !==0){
          for (let i in homePosts){
            newHomePosts.push(homePosts[i]);
          }
          for (let i in data){
            newHomePosts.push(data[i])
          }
          setHomePosts(newHomePosts);
        }
      }
      else {
        console.log("Can't get posts");
      }
    }
    catch {
      console.log("Fail");
    }
  };

  useEffect(()=> {
    getInitialHomePagePosts();
  }, []);

  const handleMorePostsOnClick = async function () {
    getMoreHomePagePosts();
  };

  const handleNewPostSubmit = async function (event) {
    event.preventDefault();

    const content = document.getElementById("userNewPostContent").value;

    const image = document.getElementById("userNewPostImage").files[0];

    if (image === undefined){
    
      if (content.length < 1 || content.length > 1000){
        return alert ("Fill correctly post content");
      }

      const res = await fetch (`${basePath}/posts`, {
        method : "POST",
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
          },
        body : JSON.stringify({
          content : content
        })
      });
      if (res.status === 200 || res.status === 201){
        document.getElementById("userNewPostContent").value = "";
        getInitialHomePagePosts();
      } else {
        console.log("Can't create post")
      }
    } 
    else {
      if (content !== "" && (content.length < 1 || content.length > 1000)){
        return alert ("Fill correctly post content");
      } 

      const formData = new FormData();
      if (content !== ""){
        formData.append("post", JSON.stringify({content : content}));
      }
      formData.append("image", image);

      const res = await fetch (`${basePath}/posts`, {
        method : "POST",
        headers: {
          'Authorization' : `Bearer ${token}`
          },
        body : formData
      });

      if (res.status === 200 || res.status === 201){
        document.getElementById("userNewPostContent").value = "";
        document.getElementById("userNewPostImage").value= "";
        getInitialHomePagePosts();
      } else {
        console.log("Can't create post")
      }
    }
  };

  const handleRefreshPostsOnClick = async function () {
    getInitialHomePagePosts();
  }

  return (
    <StyledHome>
      <Header />
      <div className="mainHome">
        <button className="mainRefreshButton" onClick = {handleRefreshPostsOnClick}>
          Refresh posts
        </button>
        <button className="mainRefreshButton830-1000" onClick = {handleRefreshPostsOnClick}>
          Refresh
        </button>
        <form className="mainHomeForm" onSubmit = { handleNewPostSubmit }>
          <div className="newPostContent" >
            <label htmlFor = "userNewPostContent" >Write your post : </label>
            <textarea id = "userNewPostContent" name = "userNewPostContent" type = "text" maxLength = "1000" />
          </div>
          <div className="newPostImage">
            <label htmlFor = "userNewPostImage" >Choose image : </label>
            <input id = "userNewPostImage" name= "userNewPostImage" type="file" accept= "image/png, image/jpeg, image/jpg" />
          </div>
          <button type="submit">Send</button>
        </form>
        <div className="homePosts">
          {(Array.isArray(homePosts) && homePosts.length !== 0) ? homePosts.map(e => 
            <Post key={e._id} _id ={e._id} content={e.content} imageUrl={e.imageUrl} postUserData={e.userData} reactions={e.reactions} comments={e.comments} />
            ) :  
            <div className="homePageNoPosts" >
              <p>No posts to show</p>
            </div>}
          <div className="homePageButtonsContainer" >
            {(Array.isArray(homePosts) && homePosts.length !== 0) && (isMorePostsToShow ?
            <button className="homePageButton" onClick={handleMorePostsOnClick}>
              View more posts
            </button> : 
            <div className="homePageNoPosts" >
              <p>No more posts to show</p>
            </div>)}
            <button className="homePageButton mainRefreshButton829" onClick = {handleRefreshPostsOnClick}>
              Refresh
            </button>
          </div>  
        </div>
      </div>
    </StyledHome>
    )
}
export default Home;