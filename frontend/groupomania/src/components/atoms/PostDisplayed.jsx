import { useState, useContext } from "react";
import {Context} from "../../utils/Context";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import CommentDisplayed from "./CommentDisplayed";
import basePath from "../../utils/basePath";
import ModifyPost from "../atoms/ModifyPost";
import colors from "../../utils/colors";

const StyledPostDisplayed = styled.div `
position : absolute;
top : 0;
left : 50%;
transform : translateX(-50%);
margin-top : 60px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
width : 490px;
display : flex;
flex-direction : column;
align-items: center;

.postDisplayed {
  position : relative;
  width : 100%;
  display : flex;
  flex-direction :column;
  align-items : center;
}

.postDisplayedImageWithContent {
  width : 444px;
  height : 297px;
  object-fit : cover;
  border-radius : 0 0 10px 10px;
  border-right : outset 3px white;
  border-bottom : outset 3px white;
  border-left : outset 3px white;
}

.postDisplayedImageWithoutContent {
  width : 450px;
  height : 300px;
  object-fit : cover;
  border-radius : 10px;
  margin-top : 30px;
}

.postDisplayedContentWithImage {
  cursor : default;
  width : 424px;
  margin : 30px 0 0 0;
  border-bottom : solid 2px ${colors.tertiary};
  border-right : outset 3px white;
  border-top : outset 3px white;
  border-left : outset 3px white;
  border-radius : 10px 10px 0 0;
  padding : 10px;
  background-color : white;
  color : #46485b;
  font-size : 20px;
}

.postDisplayedContentWithoutImage {
  cursor : default;
  width : 430px;
  margin : 30px 0 0px 0;
  border-radius : 10px;
  padding : 20px 10px 25px 10px;
  background-color : white;
  color : #46485b;
  font-size : 20px;
  border-style: outset;
  border-width :3px;
}

.postDisplayedUserData {
  text-decoration : none;
  border : solid 4px ${colors.tertiary};
  background-color : #ffebeb;
  padding : 2px;
  border-radius : 18px;
  position : absolute;
  top : -19px;
  left : 25px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.postDisplayedUserData p {
  max-width : 90px;
  overflow : hidden;
  text-overflow : ellipsis;
  font-size : 14px;
  margin : 0 10px 0 10px;
  color : #46485b;
}

.postDisplayedUserData img {
  height : 24px;
  width : 24px;
  border-radius : 50%;
}

.postDisplayedReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : 35px;
}

.postDisplayedReaction {
  position : relative;
  margin-right : -10px;
}

.postDisplayedHeartPosition {
  z-index : 5;
}

.postDisplayedThumbsUpPosition {
  z-index : 4;
}

.postDisplayedFaceGrinTearsPosition {
  z-index : 3;
}

.postDisplayedFaceSurprisePosition {
  z-index : 2;
}

.postDisplayedFaceAngryPosition {
  z-index : 1;
}

.postDisplayedReactionIcon {
  margin : 0;
  font-size : 20px;
}

.postDisplayedReactionIconBackground {
  height : 28px;
  width : 28px;
  border-radius : 50%;
  border : outset 1px white;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
}

.postDisplayedHeart {
  color : ${colors.primary};
}

.postDisplayedThumbsUp {
  color : blue;
}

.postDisplayedFaceGrinTears {
  color : #f5a742;
}

.postDisplayedFaceSurprise {
  color : #f5a742;
}

.postDisplayedFaceAngry {
  color : #f56042;
}

.postDisplayedReactionNumber {
  position : absolute;
  left : 19px;
  bottom : -2px;
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

.changePostDisplayed {
  position : absolute;
  left : 30px;
  bottom : -13px;
  display : flex;
}

.modifyPostDisplayedButton {
  background-color : #ffebeb;
  border : outset 2px ${colors.secondary};
  cursor : pointer;
  height : 22px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyPostDisplayedButton p {
  color : #46485b;
  margin : 0 13px 0 13px;
  font-size: 16px;
}

.deletePostDisplayedButton {
  margin-left : 20px;
  cursor : pointer;
  width : 22px;
  height : 22px;
  border-radius : 50%;
  background-color : ${colors.primary};
  border : outset 2px ${colors.primary};
  display : flex;
  justify-content : center;
  align-items : center;
}

.crossDeletePostDisplayedButton {
  color : white;
  font-size : 22px;
}

.postDisplayedConfirmDeletePost{
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 30px;
  padding : 20px;
  border-radius : 20px;
  background-color : white;
  border : outset 3px ${colors.primary};
}

.postDisplayedConfirmDeletePost p {
  margin : 0;
  font-size : 20px;
  color : #46485b;
}

.postDisplayedConfirmDeletePost button{
  cursor : pointer;
  color : #46485b;
  border : outset 2px ${colors.primary};
  border-radius : 5px;
  margin-left: 20px;
  height : 30px;
}

.postDisplayedComments {
  margin : 30px 0 20px 0;
  width : 404px;
  padding : 20px;
  display : flex;
  flex-direction : column;
  align-items : center;
  background-color : #ececf0;
  border-radius : 10px;
  border: outset 3px #ececf0;
  overflow : scroll;
}

.postDisplayedNoCommentsToShow {
  cursor : default;
  text-align : center;
  color : #46485b;
  margin : 0;
  font-size : 18px;
}

.closePostDisplayedContainer {
  position : absolute;
  right : -23px;
  top : 20px;
  width : 40px;
  height : 40px;
  border-radius : 50%;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
  border : outset 3px ${colors.primary};
  cursor : pointer;
}

.crossClosePostDisplayedButton {
  color : ${colors.primary};
  font-size : 20px;
}
  
.postDisplayedHandleCommentsButton {
  height : 30px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
  margin : 20px;
}

@media screen and (max-width: 549px) {
  width : 85%;
  
  .postDisplayedImageWithContent {
    width : 90%;
  }
  
  .postDisplayedImageWithoutContent {
    width : 90%;
  }
  
  .postDisplayedContentWithImage {
    width : 90%;
    padding : 10px 0 10px 0;
    font-size : 18px;
  }
  
  .postDisplayedContentWithoutImage {
    width : 90%;
    padding : 10px 0 10px 0;
    font-size : 18px;
  }
  
  .changePostDisplayed {
    left : 25px;
    bottom : -12px;
  }
  
  .modifyPostDisplayedButton {
    cursor : pointer;
    height : 20px;
    border-radius : 12px;
  }
  
  .modifyPostDisplayedButton p {
    margin : 0 10px 0 10px;
    font-size: 14px;
  }
  
  .deletePostDisplayedButton {
    margin-left : 10px;
    width : 20px;
    height : 20px;
    border : outset 2px ${colors.primary};
  }
  
  .crossDeletePostDisplayedButton {
    font-size : 20px;
  }
  
  .postDisplayedConfirmDeletePost{
    width : 90%;
    padding : 0;
    border-radius : 20px;
    background-color : white;
    border : outset 3px ${colors.primary};
  }
  
  .postDisplayedConfirmDeletePost p {
    margin : 20px 0 20px 20px;
    font-size : 18px;
  }
  
  .postDisplayedConfirmDeletePost button{
    margin: 10px;
  }
  
  .postDisplayedComments {
    width : 90%;
    padding : 20px 0 20px 0;
  }
  
  .postDisplayedNoCommentsToShow {
    font-size : 16px;
  }
  
  .postDisplayedHandleCommentsButton {
    height : 25px;
    font-size : 14px;
  }
}
`

function PostDisplayed ({postDisplayedData, setIsPostDisplayed}) {
  const {userData, token} = useContext(Context);

  const [postContent, setPostContent] = useState(postDisplayedData.content);
  const [postImageUrl, setPostImageUrl] = useState(postDisplayedData.imageUrl);

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

  const [totalPostComments, setTotalPostComments] = useState(postDisplayedData.comments);

  const commentsLimit = 2;

  const initialIsMoreCommentsToShow = totalPostComments.length > commentsLimit;

  const [isMoreCommentsToShow, setIsMoreCommentsToShow] = useState(initialIsMoreCommentsToShow);

  const initialPostComments = [];
  let i = 0;
  while (i < totalPostComments.length && i < commentsLimit){
    initialPostComments.push(totalPostComments[i]);
    i++;
  };

  const [postComments, setPostComments] = useState(initialPostComments);

  const handleMoreCommentsOnClick = () => {
    const newPostComments = [];
    let i = 0;
    while (i < postComments.length + commentsLimit && i < totalPostComments.length){
      newPostComments.push(totalPostComments[i]);
      i++;
    }

    if (newPostComments.length === totalPostComments.length){
      setIsMoreCommentsToShow(false);
    }

    setPostComments(newPostComments);
  };

  const handleHideCommentsOnClick = () => {
    const newPostComments = [];
    let i = 0;
    while (i < commentsLimit) {
      newPostComments.push(totalPostComments[i]);
      i++;
    }
    setPostComments(newPostComments);
    setIsMoreCommentsToShow(true);
  };

  const handleClosePostDisplayed = () => {
    setIsPostDisplayed(false);

    if (postContent !== postDisplayedData.content || postImageUrl !== postDisplayedData.imageUrl || totalPostComments !== postDisplayedData.comments){
      window.location.reload();
    }
  };

  const changePost = userData.isAdmin === true; 
  const [isModifyPost, setIsModifyPost] = useState(false);

  const handleModifyPost = () => {
    setIsModifyPost(true);
    setConfirmDeletePost(false);
  };

  const [confirmDeletePost, setConfirmDeletePost] = useState(false);

  const handleDeletePostButtonOnClick = () => {
    setConfirmDeletePost(true);
    setIsModifyPost(false);
  };

  const handleDeletePost = async function () {
    const res = await fetch(`${basePath}/posts/${postDisplayedData._id}`, {
      method : "DELETE",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      alert ("Post deleted");
      return window.location.reload();
    }
    else console.log("Deletion failed")
  };

  const handleCancelDeletePost = () => {
    setConfirmDeletePost(false);
  };

  return (
    <StyledPostDisplayed>
      <div className="postDisplayed" >
        <a className="postDisplayedUserData"  href={postDisplayedData.userId !== userData._id ? `/userProfile/${postDisplayedData.userId}` : '/myProfile'} >
          <img src={postDisplayedData["userData"].imageUrl} alt='Avatar'/>
          <p>{postDisplayedData["userData"].pseudo}</p>
        </a>
        <div className="postDisplayedReactions">
          {postDisplayedReactions.heart !== 0 && (<div className="postDisplayedReaction postDisplayedHeartPosition">
            <div className="postDisplayedReactionIconBackground">
              <FontAwesomeIcon className="postDisplayedReactionIcon postDisplayedHeart" icon={solid("heart")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.heart}</p>
            </div>
          </div>)}
          {postDisplayedReactions.thumbsUp !== 0 && (<div className="postDisplayedReaction postDisplayedThumbsUpPosition">
            <div className="postDisplayedReactionIconBackground">
              <FontAwesomeIcon className="postDisplayedReactionIcon postDisplayedThumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.thumbsUp}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceGrinTears !== 0 && (<div className="postDisplayedReaction postDisplayedFaceGrinTearsPosition">
            <div className="postDisplayedReactionIconBackground">
              <FontAwesomeIcon className="postDisplayedReactionIcon postDisplayedFaceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceSurprise !== 0 && (<div className="postDisplayedReaction postDisplayedFaceSurprisePosition">
            <div className="postDisplayedReactionIconBackground">
              <FontAwesomeIcon className="postDisplayedReactionIcon postDisplayedFaceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceSurprise}</p>
            </div>
          </div>)}
          {postDisplayedReactions.faceAngry !== 0 && (<div className="postDisplayedReaction postDisplayedFaceAngryPosition">
            <div className="postDisplayedReactionIconBackground">
            <FontAwesomeIcon className="postDisplayedReactionIcon postDisplayedFaceAngry" icon={solid("face-angry")} />
            </div>
            <div className="postDisplayedReactionNumber">
              <p>{postDisplayedReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        <div onClick={handleClosePostDisplayed} className="closePostDisplayedContainer" >
          <FontAwesomeIcon className="crossClosePostDisplayedButton" icon={solid("xmark")} />
        </div>
        {postContent && (postImageUrl ? <p className="postDisplayedContentWithImage">{postContent}</p> : <p className="postDisplayedContentWithoutImage">{postContent}</p>)}
        {postImageUrl && (postContent ? <img className="postDisplayedImageWithContent" src={postImageUrl} alt={`Post from ${postDisplayedData["userData"].pseudo}`}/> : <img className="postDisplayedImageWithoutContent" src={postImageUrl} alt={`Post from ${postDisplayedData["userData"].pseudo}`}/>)}
        {changePost && (<div className="changePostDisplayed" >
          <div className="modifyPostDisplayedButton" onClick={handleModifyPost} >
            <p>Modify</p>
          </div>
          <div className="deletePostDisplayedButton" onClick={handleDeletePostButtonOnClick} >
            <FontAwesomeIcon className="crossDeletePostDisplayedButton" icon={solid("xmark")} />
          </div>
        </div>)}
      </div>
      {isModifyPost && 
      <ModifyPost postId={postDisplayedData._id} content={postContent} imageUrl={postImageUrl} setIsModifyPost={setIsModifyPost} setPostContent={setPostContent} setPostImageUrl={setPostImageUrl} />}
      {confirmDeletePost && 
      <div className="postDisplayedConfirmDeletePost" >
        <p>Confirm deletion : </p>
        <button onClick={handleDeletePost} >Yes</button>
        <button onClick={handleCancelDeletePost}>No</button>
      </div>}
      <div className="postDisplayedComments" >
        {(Array.isArray(postComments) && postComments.length !== 0) ? postComments.map(e => 
          <CommentDisplayed key={e._id} commentData={e}  totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} postComments={postComments} setPostComments={setPostComments} commentsLimit={commentsLimit} />
        ) : <p className="postDisplayedNoCommentsToShow">No comments to show</p>}
        {(Array.isArray(postComments) && postComments.length !== 0) && (isMoreCommentsToShow ?
        <button className="postDisplayedHandleCommentsButton" onClick={handleMoreCommentsOnClick}>
          View older comments
        </button> : 
        <p className="postDisplayedNoCommentsToShow">No more comments to show</p>)}
        {(postComments.length > commentsLimit) && 
        <button className="postDisplayedHandleCommentsButton" onClick={handleHideCommentsOnClick}>
          Hide extra comments 
        </button>}
      </div>
    </StyledPostDisplayed>
  )
};

export default PostDisplayed;