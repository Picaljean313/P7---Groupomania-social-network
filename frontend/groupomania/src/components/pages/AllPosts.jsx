import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import PostOverview from '../atoms/PostOverview';
import colors from '../../utils/colors';


const StyledAllPosts = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainAllPosts {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.allPostsContainer {
  display : flex;
  flex-direction: column;
  align-items : center;
  margin : 40px 0 40px 0;
  width : 100%;
}

.allPostsButton {
  height : 40px;
  width : 200px;
  margin : 40px 0 40px 0;
  border-radius : 10px;
  background-color :  white;
  font-size : 18px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  border-width : 3px;
  cursor : pointer;
}

.allPostsNoPosts {
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

.allPostsNoPosts p {
  color : ${colors.secondary};
  font-size : 20px;
  margin : 0;
}

@media screen and (max-width: 519px) {
  .allPostsButton {
    height : 35px;
    width : 180px;
    font-size : 16px;
    border-width : 2px;
  }
}

@media screen and (max-width : 649px) {
  .allPostsNoPosts {
    width : 70%;
    padding : 20px;
    height : 30px;
  }
  
  .allPostsNoPosts p {
    font-size : 16px;
    margin : 0;
  }
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
        <div className="allPostsContainer" >
          {(Array.isArray(allPosts) && allPosts.length !== 0) ? allPosts.map(e => 
          <PostOverview key={e._id} postData={e} userData={e.userData} />
          ) : 
          <div className="allPostsNoPosts" >
            <p>No posts to show</p>
          </div>}
          {Array.isArray(allPosts) && allPosts.length !==0 && (isMorePostsToShow ?
          <button className="allPostsButton" onClick={handleMorePostsOnClick}>
            View more posts
          </button> : 
            <div className="allPostsNoPosts" >
              <p>No more posts to show</p>
            </div>)}
        </div>  
      </div>
    </StyledAllPosts>
  )
}
export default AllPosts;