import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import PostOverview from '../atoms/PostOverview';


const StyledAllPosts = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainAllPosts {
  position : relative;
  overflow : scroll;
}

`

function AllPosts () {
  const {token} = useContext(Context);

  const [allPosts, setAllPosts] = useState("none");
  const [isMorePostsToShow, setIsMorePostsToShow] = useState(false);

  const limit = 5;

  const getInitialAllPosts = async function () {
    const fetchLimit = limit + 1;
    try {
      const res = await fetch(`${basePath}/posts?limit=${fetchLimit}&sort=desc&reactions=true&comments=true&commentsReactions=true&userData=true&commentsUserData=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if(res.status === 200) {
        const data = await res.json();
        if (data.length === fetchLimit){
          data.splice(data.length - 1, 1);
          setIsMorePostsToShow(true);
        }
        setAllPosts(data);
      }
    }
    catch {
      console.log("Can't get posts");
    }
  };

  useEffect(()=> {
    getInitialAllPosts();
  }, []);

  const getMoreAllPosts = async function () {
    let maxDate;
    if (allPosts.length !== 0){
      maxDate = allPosts[allPosts.length - 1].creationDate;
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
    
        const newAllPosts = [];
        if (data.length !==0 && Array.isArray(allPosts) && allPosts.length !==0){
          for (let i in allPosts){
            newAllPosts.push(allPosts[i]);
          }
          for (let i in data){
            newAllPosts.push(data[i])
          }
          setAllPosts(newAllPosts);
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

  const handleMorePostsOnClick = () => {
    getMoreAllPosts();
  };

  return (
    <StyledAllPosts>
      <Header />
      <div className = "mainAllPosts" >
        {(Array.isArray(allPosts) && allPosts.length !== 0) ? allPosts.map(e => 
        <PostOverview key={e._id} postData={e} userData={e.userData} />
        ) : <p>No posts to show</p>}
        <div className="allPostsContainer" >
          {Array.isArray(allPosts) && (isMorePostsToShow ?
          <button className="allPostsButton" onClick={handleMorePostsOnClick}>
            View more posts
          </button> : 
          <p>No more posts to show</p>)}
        </div>  
      </div>
    </StyledAllPosts>
  )
}
export default AllPosts;