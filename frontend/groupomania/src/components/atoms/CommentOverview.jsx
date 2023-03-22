import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PostDisplayed from "./PostDisplayed";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import basePath from "../../utils/basePath";

const StyledCommentOverview = styled.div`
display : flex;
width : 700px;
height : 100px;
border : 1px solid green;
justify-content : space-around;
align-items : center;
margin : 20px 0 20px 0;

p {
  margin : 0;
}

.commentOverviewContent {
  width : 200px;
  heigth : 60px;
  overflow : scroll;
}

.commentOverviewUserDataContainer {
  display : flex;
}

.commentOverviewUserImage {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.commentOverviewActivityContainer p {
  margin : 0 30px 0 0;
}

.commentOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}

.postAssociated {
  position : absolute;
  top : 0;
  width : 100%;
  height : 100%;
  display : flex;
  justify-content : center;
}

.postAssociatedBackground {
  position : absolute;
  z-index : 1;
  width : 100%;
  height : 100%;
  background-color : white;
  opacity : 0.5;
  top : 0px;
}
`

function CommentOverview ({commentData, userData}) {
  const navigate = useNavigate();
  const {token} = useContext(Context);

  const [isPostDisplayed, setIsPostDisplayed] = useState(false);
  const [postAssociatedData, setPostAssociatedData] = useState("none");

  const handleShowCommentOnClick = () => {
    setIsPostDisplayed(true);
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${userData._id}`);
  };

  const getPostAssociatedData = async function () {
    const res = await fetch(`${basePath}/posts/${commentData.postId}?comments=true&reactions=true&commentsReactions=true&userData=true&commentsUserData=true`, {
      method : "GET",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200){
      const data = await res.json();

      setPostAssociatedData(data);
    } 
    else {
      console.log("Can't get associated post data");
    }
  };

  useEffect(()=>{
    getPostAssociatedData();
  }, [])
  
  
  return (
    <StyledCommentOverview>
      <p className="commentOverviewContent" >{commentData.content}</p>
      <div>
        <p>From : </p>
        <div className="commentOverviewUserDataContainer" >
          <img src={userData.imageUrl} alt='User avatar' className = "commentOverviewUserImage"/>
          <p>{userData.pseudo}</p>
        </div>
      </div>
      <div className="commentOverviewActivityContainer" >
        <p>Activity : </p>
        <p>{`${commentData.reactions.length} reactions`}</p>
      </div>
      <div className="commentOverviewButtonsContainer" >
        <button onClick={handleShowCommentOnClick} >Show associated post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
      {isPostDisplayed && <div className="postAssociated">
        <div className="postAssociatedBackground"></div>
        <PostDisplayed postDisplayedData={postAssociatedData}  setIsPostDisplayed={setIsPostDisplayed} />
      </div>} 
    </StyledCommentOverview>
  );
}

export default CommentOverview;