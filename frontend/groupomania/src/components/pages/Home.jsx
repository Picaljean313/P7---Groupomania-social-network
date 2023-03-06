import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Context } from '../../utils/Context';
import { basePath } from '../../utils/pagesData';
import Post from '../molecules/Post';
import Header from '../organisms/Header';

const StyledHome = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.main {
  overflow : scroll;
}
`

function Home () {
  const {token} = useContext(Context);

  const [homePosts, setHomePosts] = useState("none");
  const [isMorePostsToShow, setIsMorePostsToShow] = useState(false);

  const limit = 1;

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

  const handleOnClick = () => {
    getMoreHomePagePosts();
  };

  return (
    <StyledHome>
      <Header />
      <div className="main">
        {Array.isArray(homePosts) ? homePosts.map(e => 
          <Post key={e._id} _id ={e._id} content={e.content} imageUrl={e.imageUrl} userData={e.userData} reactions={e.reactions} comments={e.comments} />
          ) : <p>No posts to show</p>}
        {Array.isArray(homePosts) && (isMorePostsToShow ?
        <button onClick={handleOnClick}>
          View more posts
        </button> : 
        <p>No more posts to show</p>)}
      </div>
    </StyledHome>
    )
}
export default Home;