import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import basePath from '../../utils/basePath';
import { Context } from '../../utils/Context';
import Header from '../organisms/Header';
import CommentOverview from '../atoms/CommentOverview';
import colors from '../../utils/colors';


const StyledAllComments = styled.div`
display: flex;
flex-direction: column;
align-items : center;
with : 100%;
height: 100%;

.mainAllComments {
  display : flex;
  flex-direction : column;
  align-items : center;
  flex : 1;
  width : 100%;
  overflow : scroll;
}

.allCommentsContainer {
  display : flex;
  flex-direction: column;
  align-items : center;
  margin : 40px 0 40px 0;
  width : 100%;
}

.allCommentsButton {
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

.allCommentsNoComments {
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

.allCommentsNoComments p {
  color : ${colors.secondary};
  font-size : 20px;
  margin : 0;
}

@media screen and (max-width: 519px) {
  .allCommentsButton {
    height : 35px;
    width : 180px;
    font-size : 16px;
    border-width : 2px;
  }
}

@media screen and (max-width : 649px) {
  .allCommentsNoComments {
    width : 70%;
    padding : 20px;
    height : 30px;
  }
  
  .allCommentsNoComments p {
    font-size : 16px;
    margin : 0;
  }
}
`

function AllComments () {
  const {token} = useContext(Context);

  const [allComments, setAllComments] = useState("none");
  const [isMoreCommentsToShow, setIsMoreCommentsToShow] = useState(false);

  const limit = 5;

  const getInitialAllComments = async function () {
    const fetchLimit = limit + 1;
    try {
      const res = await fetch(`${basePath}/comments?limit=${fetchLimit}&sort=desc&reactions=true&userData=true`, {
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if(res.status === 200) {
        const data = await res.json();
        if (data.length === fetchLimit){
          data.splice(data.length - 1, 1);
          setIsMoreCommentsToShow(true);
        }
        setAllComments(data);
      }
    }
    catch {
      console.log("Can't get comments");
    }
  };

  useEffect(()=> {
    getInitialAllComments();
  }, []);

  const getMoreAllComments = async function () {
    let maxDate;
    if (allComments.length !== 0){
      maxDate = allComments[allComments.length - 1].creationDate;
    }
    const fetchLimit = limit + 2;
    try {
      const res = await fetch(`${basePath}/comments?limit=${fetchLimit}&sort=desc&reactions=true&userData=true&maxDate=${maxDate}`,{
        method : "GET",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const data = await res.json();

        const newIsMoreCommentsToShow = data.length === fetchLimit;
        if (newIsMoreCommentsToShow !== isMoreCommentsToShow){
          setIsMoreCommentsToShow(newIsMoreCommentsToShow);
        }

        if (newIsMoreCommentsToShow){
          data.splice(data.length - 1, 1);
        }
        data.splice(0,1);
    
        const newAllComments = [];
        if (data.length !==0 && Array.isArray(allComments) && allComments.length !==0){
          for (let i in allComments){
            newAllComments.push(allComments[i]);
          }
          for (let i in data){
            newAllComments.push(data[i])
          }
          setAllComments(newAllComments);
        }
      }
      else {
        console.log("Can't get comments");
      }
    }
    catch {
      console.log("Fail");
    }
  };

  const handleMoreCommentsOnClick = () => {
    getMoreAllComments();
  };

  return (
    <StyledAllComments>
      <Header />
      <div className = "mainAllComments" >
        <div className="allCommentsContainer" >
          {(Array.isArray(allComments) && allComments.length !== 0) ? allComments.map(e => 
          <CommentOverview key={e._id} commentData={e} userData={e.userData} />
          ) : 
          <div className="allCommentsNoComments" >
            <p>No comments to show</p>
          </div>}
          {Array.isArray(allComments) && allComments.length !== 0 && (isMoreCommentsToShow ?
          <button className="allCommentsButton" onClick={handleMoreCommentsOnClick}>
            View more comments
          </button> : 
            <div className="allCommentsNoComments" >
              <p>No more comments to show</p>
            </div>)}
        </div>  
      </div>
    </StyledAllComments>
  )
}
export default AllComments;