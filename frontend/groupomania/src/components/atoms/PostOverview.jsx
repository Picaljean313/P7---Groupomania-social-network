import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PostDisplayed from "./PostDisplayed";
import colors from "../../utils/colors";

const StyledPostOverview = styled.div`
margin : 20px 0 20px 0;
width : 580px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
padding : 20px;
display : flex;
align-items : center;
justify-content : space-between;

.postOverviewContainer {
  display : flex;
}

.postOverviewPostContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  display : flex;
  flex-direction : column;
  justify-content : center;
  align-items : center;
  width : 170px;
}

.postOverviewPostContainer img {
  margin : 5px 0 5px 0;
  width : 120px;
  height : 90px;
  object-fit : cover;
}

.postOverviewPostContainer p {
  margin : 5px 0 5px 0;
  max-width : 170px;
  max-height : 50px;
  overflow : scroll;
  font-size : 14px;
  color : #46485b;
  cursor : default;
}

.postOverviewDataContainer {
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  margin : 0 10px 0 10px;
  display : flex;
  flex-direction : column;
  justify-content : center;
  width : 210px;
}

.postOverviewUserDataContainer {
  display : flex;
  flex-direction : column;
  align-items : center;
  margin : 5px 0 5px 0;
}

.postOverviewLabel {
  margin : 0 10px 0 0;
  color : #46485b;
  font-size : 16px;
  cursor : default;
}

.postOverviewUserData {
  display : flex;
  align-items : center;
}

.postOverviewUserData p {
  max-width : 160px;
  overflow : hidden;
  text-overflow : ellipsis;
  color : #46485b;
  margin : 0;
  cursor : default;
}

.postOverviewUserData img {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.postOverviewActivityContainer {
  display : flex;
  justify-content : center;
  align-items : center;
  margin : 5px 0 5px 0;
}

.postOverviewActivity p {
  color : #46485b;
  margin : 0;
  font-size : 14px;
  cursor : default;
}

.postOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}

.postOverviewButtonsContainer button {
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

.postOverviewPostAssociatedReferencePosition {
  position : absolute;
  z-index : 1;
  width : 100%;
  height : 100%;
  transform : translate(-50%, -50%);
  top : 50%;
  left : 50%;
}

.postOverviewPostAssociatedBackground {
  width : 100%;
  height : 100%;
  background-color : white;
  opacity : 0.5;
}

.postOverviewPostAssociatedContainer {
  position : absolute;
  width : 100%;
  height : 100%;
  overflow : scroll;
  top : 0;
  z-index : 2;
}

@media screen and (max-width : 659px) {
  width : 80%;

  .postOverviewButtonsContainer button {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
} 

@media screen and (min-width : 550px) and (max-width : 659px) {
  flex-direction : column;

  .postOverviewDataContainer {
    margin : 0 0 0 10px;
  }

  .postOverviewButtonsContainer {
    flex-direction : row;
  }

  .postOverviewButtonsContainer button {
    margin : 20px 10px 10px 10px;
  }
}

@media screen and (max-width : 549px) {
  flex-direction : column;
  width : 70%;

  .postOverviewContainer {
    flex-direction : column;
    align-items : center;
  }

  .postOverviewPostContainer {
    width : 210px;
  }
  
  .postOverviewPostContainer img {
    width : 150px;
    height : 120px;
  }
  
  .postOverviewPostContainer p {
    max-width : 210px;
  }

  .postOverviewDataContainer {
    margin : 10px 0 0 0;
  }

  .postOverviewButtonsContainer {
    flex-direction : row;
  }

  .postOverviewButtonsContainer button {
    margin : 20px 10px 10px 10px;
  }
}
`

function PostOverview ({postData, userData}) {
  const navigate = useNavigate();

  const [isPostDisplayed, setIsPostDisplayed] = useState(false);

  const handleShowPostOnClick = () => {
    setIsPostDisplayed(true);
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${userData._id}`);
  };
  
  
  return (
    <StyledPostOverview>
      <div className="postOverviewContainer">
        <div className="postOverviewPostContainer">
          {postData.imageUrl && <img src={postData.imageUrl} alt='Post image'/>}
          {postData.content && <p>{postData.content}</p>}
        </div>
        <div className="postOverviewDataContainer">
          <div className="postOverviewUserDataContainer" >
            <p className="postOverviewLabel">From : </p>
            <div className="postOverviewUserData">
              <img src={userData.imageUrl} alt='User avatar'/>
              <p>{userData.pseudo}</p>
            </div>
          </div>
          <div className="postOverviewActivityContainer" >
            <p className="postOverviewLabel">Activity : </p>
            <div className="postOverviewActivity">
              <p>{`${postData.reactions.length} reactions`}</p>
              <p>{`${postData.comments.length} comments`}</p>
            </div>
          </div>
        </div>
        </div>
      <div className="postOverviewButtonsContainer" >
        <button onClick={handleShowPostOnClick} >Show post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
      {isPostDisplayed && <div className="postOverviewPostAssociatedReferencePosition">
        <div className="postOverviewPostAssociatedBackground"></div>
        <div className="postOverviewPostAssociatedContainer">
          <PostDisplayed postDisplayedData={postData}  setIsPostDisplayed={setIsPostDisplayed} />
        </div>
      </div>} 
    </StyledPostOverview>
  );
}

export default PostOverview;