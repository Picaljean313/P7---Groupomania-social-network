import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import CommentDisplayed from "../atoms/CommentDisplayed";

const StyledPostDisplayed = styled.div `
margin : 80px;
z-index : 2;
background-color : yellow;
border-radius : 25px;
display : flex;
flex-direction : column;
align-items: center;

.postDisplayed {
  position : relative;
  width : 600px;
  display : flex;
  flex-direction :column;
  justify-content : center;
  align-items : center;
}

img {
  width : 500px;
  height : 350px;
  object-fit : cover;;
  margin : 10px;
  border-radius : 10px;
}

.postDisplayedUserData {
  text-decoration : none;
  background-color : blue;
  padding : 5px;
  border-radius : 25px;
  position : absolute;
  top : -25px;
  left : 0px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.postDisplayedUserData p {
  font-size : 20px;
  margin : 0 10px 0 10px;
  color : white;
}

.postDisplayedUserData img {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.icon {
  font-size : 20px;
  margin : 5px;
}

.isSelected {
  color : red;
}

.postDisplayedReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : -10px;
}

.postDisplayedReaction {
  position : relative;
}

.iconPostDisplayedReaction {
  margin : 0;
  font-size : 20px;
}

.iconPostDisplayedReactionBackground {
  height : 30px;
  width : 30px;
  border-radius : 50%;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
}

.heart {
  color : red;
}

.thumbsUp {
  color : blue;
}

.faceGrinTears {
  color : orange;
}

.faceSurprise {
  color : orange;
}

.faceAngry {
  color : orange;
}

.postDisplayedReactionNumber {
  position : absolute;
  left : 19px;
  bottom : 0px;
  background-color : green;
  height : 12px;
  width : 12px;
  display : flex;
  align-items : center;
  justify-content : center;
  border-radius : 50%;
}

.postDisplayedReactionNumber p {
  margin : 0;
  color : white;
  font-size : 8px;
}

.postDisplayedUserReactions {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : 30px;
  bottom : -15px;
}

.circleClosePostDisplayed {
  position : absolute;
  right : -55px;
  top : 20px;
  width : 50px;
  height : 50px;
  border-radius : 50%;
  background-color : red;
  display : flex;
  justify-content : center;
  align-items : center;
}

.circleClosePostDisplayed:hover {
  background-color : green;
}

.crossClosePostDisplayed {
  color : white;
  font-size : 40px;
}
`

function PostDisplayed ({postDisplayedData, setIsPostDisplayed}) {
  const postDisplayedReactions = {
    heart : 0,
    thumbsUp : 0,
    faceGrinTears : 0,
    faceSurprise : 0,
    faceAngry : 0
  }

  for (let reaction of postDisplayedData.reactions){
    if (reaction.type === "heart"){
      postDisplayedReactions.heart ++;
    }
    if (reaction.type === "thumbs-up"){
      postDisplayedReactions.thumbsUp ++;
    }
    if (reaction.type === "face-grin-tears"){
      postDisplayedReactions.faceGrinTears ++;
    }
    if (reaction.type === "face-surprise"){
      postDisplayedReactions.faceSurprise ++;
    }
    if (reaction.type === "face-angry"){
      postDisplayedReactions.faceAngry ++;
    }
  };

  const commentsLimit = 2;

  const [isMoreCommentsToShow, setIsMoreCommentsToShow] = useState(postDisplayedData.comments.length > commentsLimit);

  const initialPostComments = [];
  let i = 0;
  while (i < postDisplayedData.comments.length && i < commentsLimit){
    initialPostComments.push(postDisplayedData.comments[i]);
    i++;
  };

  const [postComments, setPostComments] = useState(initialPostComments);

  const handleMoreCommentsOnClick = () => {
    const newPostComments = [];
    let i = 0;
    while (i < postComments.length + commentsLimit && i < postDisplayedData.comments.length){
      newPostComments.push(postDisplayedData.comments[i]);
      i++;
    }

    if (newPostComments.length === postDisplayedData.comments.length){
      setIsMoreCommentsToShow(false);
    }

    setPostComments(newPostComments);
  };

  const handleHideCommentsOnClick = () => {
    const newPostComments = [];
    let i = 0;
    while (i < commentsLimit) {
      newPostComments.push(postDisplayedData.comments[i]);
      i++;
    }
    setPostComments(newPostComments);
    setIsMoreCommentsToShow(true);
  };

  const handleClosePostDisplayed = () => {
    setIsPostDisplayed(false);
  };

  return (
    <StyledPostDisplayed>
      <div className="postDisplayed" >
        <div className="postDisplayedUserData" >
          <img src={postDisplayedData["userData"].imageUrl} alt='Avatar'/>
          <p>{postDisplayedData["userData"].pseudo}</p>
        </div>
        <div className="postDisplayedReactions">
          {postDisplayedReactions.heart !== 0 && (<div className="postDisplayedReaction">
            <div className="iconPostDisplayedReactionBackground">
              <FontAwesomeIcon className="iconPostDisplayedReaction heart" icon={solid("heart")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.heart}</p>
            </div>
          </div>)}
          {postDisplayedReactions.thumbsUp !== 0 && (<div className="postDisplayedReaction">
            <div className="iconPostDisplayedReactionBackground">
              <FontAwesomeIcon className="iconPostDisplayedReaction thumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.thumbsUp}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceGrinTears !== 0 && (<div className="postDisplayedReaction">
            <div className="iconPostDisplayedReactionBackground">
              <FontAwesomeIcon className="iconPostDisplayedReaction faceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceSurprise !== 0 && (<div className="postDisplayedReaction">
            <div className="iconPostDisplayedReactionBackground">
              <FontAwesomeIcon className="iconPostDisplayedReaction faceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceSurprise}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceAngry !== 0 && (<div className="postDisplayedReaction">
            <div className="iconPostDisplayedReactionBackground">
            <FontAwesomeIcon className="iconPostDisplayedReaction faceAngry" icon={solid("face-angry")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        <div onClick={handleClosePostDisplayed} className="circleClosePostDisplayed" >
          <FontAwesomeIcon className="crossClosePostDisplayed" icon={solid("xmark")} />
        </div>
        <p>{postDisplayedData.content}</p>
        {postDisplayedData.imageUrl && <img src={postDisplayedData.imageUrl} alt={`Post from ${postDisplayedData["userData"].pseudo}`}/>}
      </div>
      <div className="postDisplayedComments" >
        {(Array.isArray(postComments) && postComments.length !== 0) ? postComments.map(e => 
          <CommentDisplayed key={e._id} commentData={e} />
        ) : <p>No comments to show</p>}
        <div>
          {(Array.isArray(postComments) && postComments.length !== 0) && (isMoreCommentsToShow ?
          <button onClick={handleMoreCommentsOnClick}>
            View older comments
          </button> : 
          <p>No more comments to show</p>)}
          {(postComments.length > commentsLimit) && 
          <button onClick={handleHideCommentsOnClick}>
            Hide extra comments 
          </button>}
        </div>
      </div>
    </StyledPostDisplayed>
  )
};

export default PostDisplayed;