import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useContext, useState } from "react";
import { Context } from "../../utils/Context";
import basePath from "../../utils/basePath";
import ModifyComment from "./ModifyComment";

const StyledCommentDisplayed = styled.div `
margin : 80px;
background-color : blue;

.commentDisplayed {
  position : relative;
  width : 500px;
  border-radius : 25px 25px 0 0;
  display : flex;
  flex-direction :column;
  justify-content : center;
  align-items : center;
}

.commentDisplayedUserData {
  text-decoration : none;
  background-color : purple;
  padding : 3px;
  border-radius : 13px;
  position : absolute;
  top : -13px;
  left : 10px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.commentDisplayedUserData p {
  font-size : 10px;
  margin : 0 5px 0 5px;
  color : white;
}

.commentDisplayedUserData img {
  height : 20px;
  width : 20px;
  border-radius : 50%;
  margin : 0 5px 0 0;
}

.icon {
  font-size : 20px;
  margin : 5px;
}

.commentDisplayedReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : -10px;
}

.commentDisplayedReaction {
  position : relative;
}

.iconCommentDisplayedReaction {
  margin : 0;
  font-size : 20px;
}

.iconCommentDisplayedReactionBackground {
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

.commentDisplayedUserReaction {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : -15px;
  bottom : -15px;
}

.changeCommentDisplayed {
  position : absolute;
  left : 30px;
  bottom : -15px;
}

.modifyCommentDisplayedButton {
  background-color : white;
  height : 30px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyCommentDisplayedButton p {
  margin : 0 15px 0 15px;
}

.modifyCommentDisplayedButton:hover {
  color : green;
}

.deleteCommentDisplayedButton {
  position : absolute;
  left : 160px;
  bottom : 0;
  width : 30px;
  height : 30px;
  border-radius : 50%;
  background-color : red;
  display : flex;
  justify-content : center;
  align-items : center;
}

.deleteCommentDisplayedButton:hover {
  background-color : green;
}

.crossDeleteCommentDisplayedButton {
  color : white;
  font-size : 22px;
}

.confirmDeleteCommentDisplayed{
  width : 600px;
  heigth : 100px;
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 50px;
}

.confirmDeleteCommentDisplayed button{
  margin-left: 30px;
  height : 30px;
}
`


function CommentDisplayed ({commentData, totalPostComments, setTotalPostComments, postComments, setPostComments, commentsLimit}) {
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

  const [commentReactions, setCommentReactions] = useState(initialCommentReactions);


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
      if (newTotalPostComments.length > commentsLimit) {
        let i = 0;
        while (i < commentsLimit) {
          newPostComments.push(newTotalPostComments[i]);
          i++;
        }
      } else {
        newPostComments = newTotalPostComments;
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
          {commentReactions.heart !== 0 && (<div className="commentDisplayedReaction">
            <div className="iconCommentDisplayedReactionBackground">
              <FontAwesomeIcon className="iconCommentDisplayedReaction heart" icon={solid("heart")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.heart}</p>
            </div>
          </div>)}
          {commentReactions.thumbsUp !== 0 && (<div className="commentDisplayedReaction">
            <div className="iconCommentDisplayedReactionBackground">
              <FontAwesomeIcon className="iconCommentDisplayedReaction thumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.thumbsUp}</p>
            </div>
          </div>)}
          {commentReactions.faceGrinTears !== 0 && (<div className="commentDisplayedReaction">
            <div className="iconCommentDisplayedReactionBackground">
              <FontAwesomeIcon className="iconCommentDisplayedReaction faceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {commentReactions.faceSurprise !== 0 && (<div className="commentDisplayedReaction">
            <div className="iconCommentDisplayedReactionBackground">
              <FontAwesomeIcon className="iconCommentDisplayedReaction faceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceSurprise}</p>
            </div>
          </div>)}
          {commentReactions.faceAngry !== 0 && (<div className="commentDisplayedReaction">
            <div className="iconCommentDisplayedReactionBackground">
            <FontAwesomeIcon className="iconCommentDisplayedReaction faceAngry" icon={solid("face-angry")} />
            </div>
            <div className="commentDisplayedReactionNumber">
              <p>{commentReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        <p>{commentContent}</p>
        {changeComment && (<div className="changeCommentDisplayed" >
          <div className="modifyCommentDisplayedButton" onClick={handleModifyComment} >
            <p>Modify comment</p>
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
        <p>Confirm comment deletion : </p>
        <button onClick={handleDeleteComment} >Yes</button>
        <button onClick={handleCancelDeleteComment}>No</button>
      </div>}
    </StyledCommentDisplayed>
  );
}
export default CommentDisplayed;