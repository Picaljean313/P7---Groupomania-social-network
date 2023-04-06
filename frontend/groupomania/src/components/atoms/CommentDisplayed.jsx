import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useContext, useState } from "react";
import { Context } from "../../utils/Context";
import basePath from "../../utils/basePath";
import ModifyComment from "./ModifyComment";
import colors from "../../utils/colors";

const StyledCommentDisplayed = styled.div `
margin : 10px 0 40px 0;
width : 364px;
background-color : ${colors.tertiary};
border : outset 3px ${colors.tertiary};
position : relative;
border-radius : 10px;
padding : 40px 20px 40px 20px;

.commentDisplayedContent {
  margin : 0;
  font-size : 16px;
  color : white;
}


.commentDisplayedUserData {
  text-decoration : none;
  border : solid 2px ${colors.tertiary};
  background-color : #ffebeb;
  padding : 2px;
  border-radius : 18px;
  position : absolute;
  top : -14px;
  left : 10px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.commentDisplayedUserData p {
  max-width : 90px;
  overflow : hidden;
  text-overflow : ellipsis;
  font-size : 14px;
  margin : 0 10px 0 10px;
  color : #46485b;
}

.commentDisplayedUserData img {
  height : 20px;
  width : 20px;
  border-radius : 50%;
}

.commentDisplayedReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : 20px;
}

.commentDisplayedReaction {
  position : relative;
  margin-right : -10px;
}

.commentDisplayedHeartPosition {
  z-index : 5;
}

.commentDisplayedThumbsUpPosition {
  z-index : 4;
}

.commentDisplayedFaceGrinTearsPosition {
  z-index : 3;
}

.commentDisplayedFaceSurprisePosition {
  z-index : 2;
}

.commentDisplayedFaceAngryPosition {
  z-index : 1;
}

.commentDisplayedReactionIcon {
  margin : 0;
  font-size : 20px;
}

.commentDisplayedReactionIconBackground {
  height : 28px;
  width : 28px;
  border-radius : 50%;
  border : outset 1px white;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
}

.commentDisplayedHeart {
  color : ${colors.primary};
}

.commentDisplayedThumbsUp {
  color : blue;
}

.commentDisplayedFaceGrinTears {
  color : #f5a742;
}

.commentDisplayedFaceSurprise {
  color : #f5a742;
}

.commentDisplayedFaceAngry {
  color : #f56042;
}

.commentDisplayedReactionNumber {
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

.commentDisplayedReactionNumber p {
  margin : 0;
  color : white;
  font-size : 8px;
}

.changeCommentDisplayed {
  position : absolute;
  left : 10px;
  bottom : -12px;
  display : flex;
}

.modifyCommentDisplayedButton {
  background-color : #ffebeb;
  border : outset 2px ${colors.secondary};
  cursor : pointer;
  height : 18px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyCommentDisplayedButton p {
  color : #46485b;
  margin : 0 13px 0 13px;
  font-size : 12px;
}

.deleteCommentDisplayedButton {
  margin-left : 20px;
  cursor : pointer;
  width : 18px;
  height : 18px;
  border-radius : 50%;
  background-color : ${colors.primary};
  border : outset 2px ${colors.primary};
  display : flex;
  justify-content : center;
  align-items : center;
}

.crossDeleteCommentDisplayedButton {
  color : white;
  font-size : 22px;
}

.confirmDeleteCommentDisplayed{
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 30px;
  padding : 20px;
  border-radius : 20px;
  background-color : white;
  border : outset 3px ${colors.primary};
}

.confirmDeleteCommentDisplayed p {
  margin : 0;
  font-size : 20px;
  color : #46485b;
}

.confirmDeleteCommentDisplayedButtonsContainer {
  display : flex;
}

.confirmDeleteCommentDisplayedButtonsContainer button{
  cursor : pointer;
  color : #46485b;
  border : outset 2px ${colors.primary};
  border-radius : 5px;
  margin-left: 20px;
  height : 30px;
}

@media screen and (max-width: 549px) {
  width : 80%;
  display : flex;
  flex-direction : column;
  align-items : center;
  
  .commentDisplayedContent {
    width : 100%;
    margin-left : 10px;
    font-size : 14px;
  }
  
  .changeCommentDisplayed {
    left : 5px;
    bottom : -12px;
  }
  
  .modifyCommentDisplayedButton {
    height : 20px;
    border-radius : 12px;
  }
  
  .modifyCommentDisplayedButton p {
    margin : 0 10px 0 10px;
    font-size: 14px;
  }
  
  .deleteCommentDisplayedButton {
    margin-left : 10px;
    width : 20px;
    height : 20px;
    border : outset 2px ${colors.primary};
  }
  
  .crossDeleteCommentDisplayedButton {
    font-size : 20px;
  }
  
  .confirmDeleteCommentDisplayed{
    width : 100%;
    padding : 0;
    border-radius : 20px;
    background-color : white;
    border : outset 3px ${colors.primary};
  }
  
  .confirmDeleteCommentDisplayed p {
    margin : 10px 0 10px 10px;
    font-size : 18px;
  }
  
  .confirmDeleteCommentDisplayedButtonsContainer button{
    margin: 5px;
  }
`

function CommentDisplayed ({commentData, totalPostComments, setTotalPostComments, postComments, setPostComments}) {
  const {token, userData} = useContext(Context);

  const [commentContent, setCommentContent] = useState(commentData.content);

  const initialCommentReactions = {
    heart : 0,
    thumbsUp : 0,
    faceGrinTears : 0,
    faceSurprise : 0,
    faceAngry : 0
  };

  for (let reaction of commentData.reactions){
    if (reaction.type === "heart"){
      initialCommentReactions.heart ++;
    }
    if (reaction.type === "thumbs-up"){
      initialCommentReactions.thumbsUp ++;
    }
    if (reaction.type === "face-grin-tears"){
      initialCommentReactions.faceGrinTears ++;
    }
    if (reaction.type === "face-surprise"){
      initialCommentReactions.faceSurprise ++;
    }
    if (reaction.type === "face-angry"){
      initialCommentReactions.faceAngry ++;
    }
  };

  const [commentReactions] = useState(initialCommentReactions);


  const changeComment = userData.isAdmin === true; 
  const [isModifyComment, setIsModifyComment] = useState(false);

  const handleModifyComment = () => {
    setIsModifyComment(true);
    setConfirmDeleteComment(false);
  };

  const [confirmDeleteComment, setConfirmDeleteComment] = useState(false);

  const handleDeleteCommentButtonOnClick = () => {
    setConfirmDeleteComment(true);
    setIsModifyComment(false);
  };

  const handleDeleteComment = async function () {
    const res = await fetch(`${basePath}/comments/${commentData._id}`, {
      method : "DELETE",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200){
      const newTotalPostComments = [];
      for (let comment of totalPostComments){
        if (comment._id !== commentData._id){
          newTotalPostComments.push(comment);
        }
      }

      const newPostComments = [];
      for (let comment of postComments){
        if (comment._id !== commentData._id){
          newPostComments.push(comment);
        }
      }

      setTotalPostComments(newTotalPostComments);
      setPostComments(newPostComments);

      return alert ("Comment deleted")
    }
    else console.log("Deletion failed")
  };

  const handleCancelDeleteComment = () => {
    setConfirmDeleteComment(false);
  };
  
  return (
    <StyledCommentDisplayed>
      <div className="commentDisplayed">
        <div className="commentDisplayedUserData" href={`/userProfile/${commentData["userData"]._id}`} >
          <img src={commentData["userData"].imageUrl} alt='Avatar'/>
          <p>{commentData["userData"].pseudo}</p>
        </div>
        <div className="commentDisplayedReactions">
          {commentReactions.heart !== 0 && (<div className="commentDisplayedReaction commentDisplayedHeartPosition">
            <div className="commentDisplayedReactionIconBackground">
              <FontAwesomeIcon className="commentDisplayedReactionIcon commentDisplayedHeart" icon={solid("heart")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.heart}</p>
            </div>
          </div>)}
          {commentReactions.thumbsUp !== 0 && (<div className="commentDisplayedReaction commentDisplayedThumbsUpPosition">
            <div className="commentDisplayedReactionIconBackground">
              <FontAwesomeIcon className="commentDisplayedReactionIcon commentDisplayedThumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.thumbsUp}</p>
            </div>
          </div>)}
          {commentReactions.faceGrinTears !== 0 && (<div className="commentDisplayedReaction commentDisplayedFaceGrinTearsPosition">
            <div className="commentDisplayedReactionIconBackground">
              <FontAwesomeIcon className="commentDisplayedReactionIcon commentDisplayedFaceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {commentReactions.faceSurprise !== 0 && (<div className="commentDisplayedReaction commentDisplayedFaceSurprisePosition">
            <div className="commentDisplayedReactionIconBackground">
              <FontAwesomeIcon className="commentDisplayedReactionIcon commentDisplayedFaceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceSurprise}</p>
            </div>
          </div>)}
          {commentReactions.faceAngry !== 0 && (<div className="commentDisplayedReaction commentDisplayedFaceAngryPosition">
            <div className="commentDisplayedReactionIconBackground">
            <FontAwesomeIcon className="commentDisplayedReactionIcon commentDisplayedFaceAngry" icon={solid("face-angry")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        <p className="commentDisplayedContent" >{commentContent}</p>
        {changeComment && (<div className="changeCommentDisplayed" >
          <div className="modifyCommentDisplayedButton" onClick={handleModifyComment} >
            <p>Modify</p>
          </div>
          <div className="deleteCommentDisplayedButton" onClick={handleDeleteCommentButtonOnClick} >
            <FontAwesomeIcon className="crossDeleteCommentDisplayedButton" icon={solid("xmark")} />
          </div>
        </div>)}
      </div>
      {isModifyComment && 
      <ModifyComment commentId={commentData._id} content={commentContent} setIsModifyComment={setIsModifyComment} setCommentContent={setCommentContent} totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} postComments={postComments} setPostComments={setPostComments} />}
      {confirmDeleteComment && 
      <div className="confirmDeleteCommentDisplayed" >
        <p>Confirm deletion : </p>
        <div className="confirmDeleteCommentDisplayedButtonsContainer" >
          <button onClick={handleDeleteComment} >Yes</button>
          <button onClick={handleCancelDeleteComment}>No</button>
        </div>
      </div>}
    </StyledCommentDisplayed>
  );
}
export default CommentDisplayed;