import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import basePath from '../../utils/basePath';
import Post from '../molecules/Post';
import Header from '../organisms/Header';

const StyledHome = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainHome {
  position : relative;
  overflow : scroll;
}

.mainRefreshButton {
  position : absolute;
  right : 20px;
  height : 50px;
}

.homePageButtonsContainer {
  display : flex;
  justify-content : space-around;
}

.homePageButton {
  height : 30px;
  width : 200px;
}
`

function Home () {
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
    
    if (content.length < 1 || content.length > 1000){
      return alert ("Fill correctly post content");
    }

    const image = document.getElementById("userNewPostImage").files[0];

    if (image === undefined){
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
      const formData = new FormData();
      formData.append("post", JSON.stringify({content : content}));
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
        <form onSubmit = { handleNewPostSubmit }>
          <div className="newPostContent" >
            <label htmlFor = "userNewPostContent" >Write your post : </label>
            <textarea id = "userNewPostContent" name = "userNewPostContent" type = "text" maxLength = "1000" />
          </div>
          <div className="newPostImage">
            <label htmlFor = "userNewPostImage" >Choose post image : </label>
            <input id = "userNewPostImage" name= "userNewPostImage" type="file" accept= "image/png, image/jpeg, image/jpg" />
          </div>
          <button type="submit">Envoyer</button>
        </form>
        <div className="homePosts" >
          {Array.isArray(homePosts) ? homePosts.map(e => 
            <Post key={e._id} _id ={e._id} content={e.content} imageUrl={e.imageUrl} postUserData={e.userData} reactions={e.reactions} comments={e.comments} />
            ) : <p>No posts to show</p>}
          <div className="homePageButtonsContainer" >
            {Array.isArray(homePosts) && (isMorePostsToShow ?
            <button className="homePageButton" onClick={handleMorePostsOnClick}>
              View more posts
            </button> : 
            <p>No more posts to show</p>)}
            <button className="homePageButton" onClick = {handleRefreshPostsOnClick}>
              Refresh posts
            </button>
          </div>  
        </div>
      </div>
    </StyledHome>
    )
}
export default Home;