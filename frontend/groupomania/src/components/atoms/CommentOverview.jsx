import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PostDisplayed from "./PostDisplayed";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import basePath from "../../utils/basePath";
import colors from "../../utils/colors";

const StyledCommentOverview = styled.div`
margin : 20px 0 20px 0;
width : 580px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
padding : 20px;
display : flex;
align-items : center;
justify-content : space-between;

.commentOverviewContainer {
  display : flex;
}

.commentOverviewCommentContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  display : flex;
  flex-direction : column;
  justify-content : center;
  width : 170px;
  height : 100px;
}

.commentOverviewCommentContainer p {
  margin : 5px 0 5px 0;
  max-width : 170px;
  max-height : 90px;
  overflow : scroll;
  word-break : break-all;
  font-size : 14px;
  color : #46485b;
  cursor : default;
}

.commentOverviewDataContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  margin : 0 10px 0 10px;
  display : flex;
  flex-direction : column;
  width : 210px;
  height :100px;
}

.commentOverviewUserDataContainer {
  display : flex;
  flex-direction : column;
  align-items : center;
  margin : 5px 0 5px 0;
}

.commentOverviewLabel {
  margin : 0 10px 0 0;
  color : #46485b;
  font-size : 16px;
  cursor : default;
}

.commentOverviewUserData {
  display : flex;
  align-items : center;
}

.commentOverviewUserData p {
  max-width : 160px;
  overflow : hidden;
  text-overflow : ellipsis;
  color : #46485b;
  margin : 0;
  cursor : default;
}

.commentOverviewUserData img {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.commentOverviewActivityContainer {
  display : flex;
  justify-content : center;
  align-items : center;
  margin : 5px 0 5px 0;
}

.commentOverviewReactions {
  color : #46485b;
  margin : 0;
  font-size : 14px;
  cursor : default;
}

.commentOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}

.commentOverviewButtonsContainer button {
  height : 30px;
  width : 120px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
  margin : 5px 0 5px 0;
}

.commentOverviewPostAssociatedReferencePosition {
  position : absolute;
  z-index : 1;
  width : 100%;
  height : 100%;
  transform : translate(-50%, -50%);
  top : 50%;
  left : 50%;
}

.commentOverviewPostAssociatedBackground {
  width : 100%;
  height : 100%;
  background-color : white;
  opacity : 0.5;
}

.commentOverviewPostAssociatedContainer {
  position : absolute;
  width : 100%;
  height : 100%;
  overflow : scroll;
  top : 0;
  z-index : 2;
}

@media screen and (max-width : 659px) {
  width : 80%;

  .commentOverviewButtonsContainer button {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
} 

@media screen and (min-width : 550px) and (max-width : 659px) {
  flex-direction : column;

  .commentOverviewDataContainer {
    margin : 0 0 0 10px;
  }

  .commentOverviewButtonsContainer {
    flex-direction : row;
  }

  .commentOverviewButtonsContainer button {
    margin : 20px 10px 10px 10px;
  }
}

@media screen and (max-width : 549px) {
  flex-direction : column;
  width : 70%;

  .commentOverviewContainer {
    flex-direction : column;
    align-items : center;
  }

  .commentOverviewCommentContainer {
    width : 210px;
  }
  
  .commentOverviewCommentContainer img {
    width : 150px;
    height : 120px;
  }
  
  .commentOverviewCommentContainer p {
    max-width : 210px;
  }

  .commentOverviewDataContainer {
    margin : 10px 0 0 0;
  }

  .commentOverviewButtonsContainer {
    flex-direction : row;
  }

  .commentOverviewButtonsContainer button {
    margin : 20px 10px 10px 10px;
  }
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
      <div className="commentOverviewContainer">
        <div className="commentOverviewCommentContainer">
          <p>{commentData.content}</p>
        </div>
        <div className="commentOverviewDataContainer">
          <div className="commentOverviewUserDataContainer" >
            <p className="commentOverviewLabel">From : </p>
            <div className="commentOverviewUserData" >
              <img src={userData.imageUrl} alt='User avatar'/>
              <p>{userData.pseudo}</p>
            </div>
          </div>
          <div className="commentOverviewActivityContainer" >
            <p className="commentOverviewLabel">Activity : </p>
            <p className="commentOverviewReactions">{`${commentData.reactions.length} reactions`}</p>
          </div>
        </div>
      </div>
      <div className="commentOverviewButtonsContainer" >
        <button onClick={handleShowCommentOnClick} >Show post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
      {isPostDisplayed && <div className="commentOverviewPostAssociatedReferencePosition">
        <div className="commentOverviewPostAssociatedBackground"></div>
        <div className="commentOverviewPostAssociatedContainer">
          <PostDisplayed postDisplayedData={postAssociatedData}  setIsPostDisplayed={setIsPostDisplayed} />
        </div>
      </div>} 
    </StyledCommentOverview>
  );
}

export default CommentOverview;