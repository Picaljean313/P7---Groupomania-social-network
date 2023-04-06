import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import basePath from '../../utils/basePath';
import { useContext, useEffect } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";
import ModifyComment from "./ModifyComment";
import colors from "../../utils/colors";

const reactionHover = keyframes`
0% {
  rotate : 0;
  font-size : 20px;
}
50% {
  rotate : 180deg;
  font-size : 30px;
}
100% {
  rotate : 360deg;
  font-size : 20px;
}
`

const StyledComment = styled.div `
margin : 10px 0 40px 0;
width : 364px;
background-color : ${colors.tertiary};
border : outset 3px ${colors.tertiary};
position : relative;
border-radius : 10px;
padding : 40px 20px 40px 20px;

.commentContent {
  margin : 0;
  font-size : 16px;
  color : white;
}


.commentUserData {
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

.commentUserData p {
  max-width : 90px;
  overflow : hidden;
  text-overflow : ellipsis;
  font-size : 14px;
  margin : 0 10px 0 10px;
  color : #46485b;
}

.commentUserData img {
  height : 20px;
  width : 20px;
  border-radius : 50%;
}

.commentUserReactions {
  border : outset 2px ${colors.secondary};
  background-color : #ffebeb;
  padding : 0 2px 0 2px;
  border-radius : 13px;
  position : absolute;
  right : 10px;
  bottom : -13px;
}

.commentUserReactionIcon {
  color : #46485b;
  font-size : 16px;
  margin : 3px 2px 3px 2px;
  vertical-align : -3.5px;
}

.commentReport {
  border : outset 2px ${colors.secondary};
  background-color : #ffebeb;
  height : 22px;
  width : 22px;
  border-radius : 13px;
  position : absolute;
  right : 140px;
  bottom : -13px;
  display : flex;
  justify-content : center;
  align-items : center;
  cursor : pointer;
  color : ${colors.tertiary};
  font-size : 14px;
}

.commentReport p {
  margin : 0;
}

.isCommentReported {
  background-color : white;
  border : outset 3px ${colors.primary};
  color : ${colors.primary};
  font-size : 18px;
  width: 30px;
  height : 30px;
  bottom : -18px;
  right : 136px;
  border-radius : 18px;
}

.commentIsSelected {
  color : green;
}

.commentReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : 20px;
}

.commentReaction {
  position : relative;
  margin-right : -10px;
}

.commentHeartPosition {
  z-index : 5;
}

.commentThumbsUpPosition {
  z-index : 4;
}

.commentFaceGrinTearsPosition {
  z-index : 3;
}

.commentFaceSurprisePosition {
  z-index : 2;
}

.commentFaceAngryPosition {
  z-index : 1;
}

.commentReactionIcon {
  margin : 0;
  font-size : 20px;
}

.commentReactionIconBackground {
  height : 28px;
  width : 28px;
  border-radius : 50%;
  border : outset 1px white;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
}

.commentHeart {
  color : ${colors.primary};
}

.commentThumbsUp {
  color : blue;
}

.commentFaceGrinTears {
  color : #f5a742;
}

.commentFaceSurprise {
  color : #f5a742;
}

.commentFaceAngry {
  color : #f56042;
}

.commentReactionNumber {
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

.commentReactionNumber p {
  margin : 0;
  color : white;
  font-size : 8px;
}

.changeComment {
  position : absolute;
  left : 10px;
  bottom : -12px;
  display : flex;
}

.modifyCommentButton {
  background-color : #ffebeb;
  border : outset 2px ${colors.secondary};
  cursor : pointer;
  height : 18px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyCommentButton p {
  color : #46485b;
  margin : 0 13px 0 13px;
  font-size : 12px;
}

.deleteCommentButton {
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

.crossDeleteCommentButton {
  color : white;
  font-size : 22px;
}

.confirmDeleteComment{
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 30px;
  padding : 20px;
  border-radius : 20px;
  background-color : white;
  border : outset 3px ${colors.primary};
}

.confirmDeleteComment p {
  margin : 0;
  font-size : 20px;
  color : #46485b;
}

.confirmDeleteCommentButtonsContainer {
  display : flex;
}

.confirmDeleteCommentButtonsContainer button{
  cursor : pointer;
  color : #46485b;
  border : outset 2px ${colors.primary};
  border-radius : 5px;
  margin-left: 20px;
  height : 30px;
}

@media screen and (min-width: 520px) {
  .commentUserReactionIcon:hover {
    animation : ${reactionHover} 1000ms linear;
  }
}

@media screen and (max-width: 519px) {
  width : 80%;
  display : flex;
  flex-direction : column;
  align-items : center;
  
  .commentContent {
    width : 100%;
    margin-left : 10px;
    font-size : 14px;
  }
  
  .commentUserReactions {
    border-radius : 12px;
    right : 5px;
    bottom : -12px;
  }
  
  .commentUserReactionIcon {
    font-size : 14px;
    margin : 2px 1px 2px 1px;
    vertical-align : -2.5px;
  }
  
  .commentReport {
    height : 20px;
    width : 20px;
    border-radius : 12px;
    right : 105px;
    bottom : -12px;
    font-size : 12px;
  }
  
  .isCommentReported {
    border : outset 2px ${colors.primary};
    font-size : 14px;
    width: 26px;
    height : 26px;
    bottom : -15px;
    right : 125px;
    border-radius : 15px;
  }
  
  .commentReactionIcon {
    font-size : 16px;
  }
  
  .commentReactionIconBackground {
    height : 24px;
    width : 24px;
  }
  
  .changeComment {
    left : 5px;
    bottom : -12px;
  }
  
  .modifyCommentButton {
    height : 20px;
    border-radius : 12px;
  }
  
  .modifyCommentButton p {
    margin : 0 10px 0 10px;
    font-size: 14px;
  }
  
  .deleteCommentButton {
    margin-left : 10px;
    width : 20px;
    height : 20px;
    border : outset 2px ${colors.primary};
  }
  
  .crossDeleteCommentButton {
    font-size : 20px;
  }
  
  .confirmDeleteComment{
    width : 100%;
    padding : 0;
    border-radius : 20px;
    background-color : white;
    border : outset 3px ${colors.primary};
  }
  
  .confirmDeleteComment p {
    margin : 10px 0 10px 10px;
    font-size : 18px;
  }
  
  .confirmDeleteCommentButtonsContainer button{
    margin: 5px;
  }
}
`


function Comment ({_id, content, commentUserData, reactions, totalPostComments, setTotalPostComments, postComments, setPostComments}) {
  const {token, userData} = useContext(Context);

  const [commentContent, setCommentContent] = useState(content);

  const [isCommentReported, setIsCommentReported] = useState(false);
  const [reportId, setReportId] = useState("none");

  let initialUserReaction = "none";

  for (let i in reactions){
    if (reactions[i].userId === userData._id && ["heart", "thumbs-up", "face-grin-tears", "face-surprise", "face-angry"].includes(reactions[i].type)){
      initialUserReaction = reactions[i];
    }
  }

  const [userReaction, setUserReaction] = useState (initialUserReaction);

  const initialCommentReactions = {
    heart : 0,
    thumbsUp : 0,
    faceGrinTears : 0,
    faceSurprise : 0,
    faceAngry : 0
  };

  for (let reaction of reactions){
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


  const handleCommentReactionOnClick = async function (reaction) {
    if (userReaction === "none"){
      const res = await fetch(`${basePath}/reactions`, {
        method : "POST",
        headers : {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({
          type : reaction,
          commentId : _id
        })
      });
      if (res.status === 200 || res.status === 201){
        const apiReaction = await res.json();

        const newCommentReactions = {}; 
        for (let key of Object.keys(commentReactions)){
          newCommentReactions[key]= commentReactions[key];
        }
        switch (reaction){
          case "heart" : newCommentReactions.heart++;
          break;
          case "thumbs-up" : newCommentReactions.thumbsUp++;
          break;
          case "face-grin-tears" : newCommentReactions.faceGrinTears++;
          break;
          case "face-surprise" : newCommentReactions.faceSurprise++;
          break;
          case "face-angry" : newCommentReactions.faceAngry++;
          break;
          default : console.log("Can't add user reaction");
        }
        setCommentReactions(newCommentReactions);

        setUserReaction(apiReaction.reaction);

        const newTotalPostComments = totalPostComments;
        for (let i in newTotalPostComments){
          if(newTotalPostComments[i]._id === _id){
            newTotalPostComments[i].reactions.push(apiReaction.reaction);
          }
        }

        return setTotalPostComments(newTotalPostComments);
      }
    }
    if (userReaction.type !== reaction) {
      const res = await fetch(`${basePath}/reactions/${userReaction._id}`, {
        method : "PUT",
        headers : {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({
          type : reaction
        })
      });
      if (res.status === 200 || res.status === 201){

        const newCommentReactions = {}; 
        for (let key of Object.keys(commentReactions)){
          newCommentReactions[key]= commentReactions[key];
        }
        switch (userReaction.type){
          case "heart" : newCommentReactions.heart--;
          break;
          case "thumbs-up" : newCommentReactions.thumbsUp--;
          break;
          case "face-grin-tears" : newCommentReactions.faceGrinTears--;
          break;
          case "face-surprise" : newCommentReactions.faceSurprise--;
          break;
          case "face-angry" : newCommentReactions.faceAngry--;
          break;
          default : console.log("Can't remove user reaction");
        }
        switch (reaction){
          case "heart" : newCommentReactions.heart++;
          break;
          case "thumbs-up" : newCommentReactions.thumbsUp++;
          break;
          case "face-grin-tears" : newCommentReactions.faceGrinTears++;
          break;
          case "face-surprise" : newCommentReactions.faceSurprise++;
          break;
          case "face-angry" : newCommentReactions.faceAngry++;
          break;
          default : console.log("Can't add user reaction");
        }
        setCommentReactions(newCommentReactions);

        const newUserReaction = {};
        for (let key of Object.keys(userReaction)){
          newUserReaction[key] = userReaction[key];
        }
        newUserReaction.type = reaction;
        setUserReaction(newUserReaction);

        const newTotalPostComments = [];
        for (let i in totalPostComments){
          if(totalPostComments[i]._id === _id){
            for (let j in totalPostComments[i].reactions){
              if (totalPostComments[i].reactions[j].userId === userData._id){
                const newComment = totalPostComments[i];
                newComment.reactions.splice(j, 1, newUserReaction);
                newTotalPostComments.push(newComment);
              }
            }
          } else {
            newTotalPostComments.push(totalPostComments[i]);
          }
        }

        return setTotalPostComments(newTotalPostComments);
      }
    }
    if (userReaction.type === reaction){
      const res = await fetch(`${basePath}/reactions/${userReaction._id}`, {
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.status === 200 || res.status === 201){

        const newCommentReactions = {}; 
        for (let key of Object.keys(commentReactions)){
          newCommentReactions[key]= commentReactions[key];
        }
        switch (reaction){
          case "heart" : newCommentReactions.heart--;
          break;
          case "thumbs-up" : newCommentReactions.thumbsUp--;
          break;
          case "face-grin-tears" : newCommentReactions.faceGrinTears--;
          break;
          case "face-surprise" : newCommentReactions.faceSurprise--;
          break;
          case "face-angry" : newCommentReactions.faceAngry--;
          break;
          default : console.log("Can't remove user reaction");
        }
        setCommentReactions(newCommentReactions);

        setUserReaction("none");

        const newTotalPostComments = [];
        for (let i in totalPostComments){
          if(totalPostComments[i]._id === _id){
            for (let j in totalPostComments[i].reactions){
              if (totalPostComments[i].reactions[j].userId === userData._id){
                const newComment = totalPostComments[i];
                newComment.reactions.splice(j, 1);
                newTotalPostComments.push(newComment);
              }
            }
          } else {
            newTotalPostComments.push(totalPostComments[i]);
          }
        }

        return setTotalPostComments(newTotalPostComments);
      }
    }
    return console.log("Check onClick");
  };

  const changeComment = (userData._id === commentUserData._id || userData.isAdmin); 
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
    const res = await fetch(`${basePath}/comments/${_id}`, {
      method : "DELETE",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200){
      const newTotalPostComments = [];
      for (let comment of totalPostComments){
        if (comment._id !== _id){
          newTotalPostComments.push(comment);
        }
      }

      const newPostComments = [];
      for (let comment of postComments){
        if (comment._id !== _id){
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

  const hasUserReportedComment = async function () {
    const res = await fetch(`${basePath}/reports?fromUserId=${userData._id}&fromCommentId=${_id}`, {
      method : "GET",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      const resJson = await res.json();
      if (resJson.length === 1){
        setIsCommentReported(true);
        setReportId(resJson[0]._id);
      }
    }
  };

  useEffect(()=> {
    if (commentUserData._id !== userData._id) {
      hasUserReportedComment();
    }
  },[]);

  const handleCommentReportOnClick = async function () {
    if (isCommentReported === false) {
      const res = await fetch (`${basePath}/reports`, {
        method : "POST",
        headers : {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({commentId : _id })
      });

      if (res.status === 200 || res.status === 201) {
        const resJson = await res.json();
        const report = resJson.report;
        setReportId(report._id);
        setIsCommentReported(true);
        return alert("Comment reported. Click once more to cancel report")
      } else {
        return console.log("Report failed")
      }
    }

    if (isCommentReported === true) {
      if (reportId === "none") return console.log("Report deletion failed")

      const res = await fetch (`${basePath}/reports/${reportId}`, {
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        setReportId("none");
        setIsCommentReported(false);
        return alert("Comment report canceled")
      } else {
        return console.log("Report deletion failed")
      }
    }
  };
  
  return (
    <StyledComment>
      <a className="commentUserData" href={commentUserData._id !== userData._id ? `/userProfile/${commentUserData._id}` : '/myProfile'} >
        <img src={commentUserData.imageUrl} alt='Avatar'/>
        <p>{commentUserData.pseudo}</p>
      </a>
      <div className="commentReactions">
        {commentReactions.heart !== 0 && (<div className="commentReaction commentHeartPosition">
          <div className="commentReactionIconBackground">
            <FontAwesomeIcon className="commentReactionIcon commentHeart" icon={solid("heart")} />
          </div>
          <div className="commentReactionNumber">
            <p>{commentReactions.heart}</p>
          </div>
        </div>)}
        {commentReactions.thumbsUp !== 0 && (<div className="commentReaction commentThumbsUpPosition">
          <div className="commentReactionIconBackground">
            <FontAwesomeIcon className="commentReactionIcon commentThumbsUp" icon={solid("thumbs-up")} />
          </div>
          <div className="commentReactionNumber">
            <p>{commentReactions.thumbsUp}</p>
          </div>
        </div>)}
        {commentReactions.faceGrinTears !== 0 && (<div className="commentReaction commentFaceGrinTearsPosition">
          <div className="commentReactionIconBackground">
            <FontAwesomeIcon className="commentReactionIcon commentFaceGrinTears" icon={solid("face-grin-tears")} />
          </div>
          <div className="commentReactionNumber">
            <p>{commentReactions.faceGrinTears}</p>
          </div>
        </div>)}
        {commentReactions.faceSurprise !== 0 && (<div className="commentReaction commentFaceSurprisePosition">
          <div className="commentReactionIconBackground">
            <FontAwesomeIcon className="commentReactionIcon commentFaceSurprise" icon={solid("face-surprise")} />
          </div>
          <div className="commentReactionNumber">
            <p>{commentReactions.faceSurprise}</p>
          </div>
        </div>)}
        {commentReactions.faceAngry !== 0 && (<div className="commentReaction commentFaceAngryPosition">
          <div className="commentReactionIconBackground">
          <FontAwesomeIcon className="commentReactionIcon commentFaceAngry" icon={solid("face-angry")} />
          </div>
          <div className="commentReactionNumber">
            <p>{commentReactions.faceAngry}</p>
          </div>
        </div>)}
      </div>
      <p className="commentContent ">{commentContent}</p>
      {changeComment && (<div className="changeComment" >
        <div className="modifyCommentButton" onClick={handleModifyComment} >
          <p>Modify</p>
        </div>
        <div className="deleteCommentButton" onClick={handleDeleteCommentButtonOnClick} >
          <FontAwesomeIcon className="crossDeleteCommentButton" icon={solid("xmark")} />
        </div>
      </div>)}
      <div className="commentUserReactions" >
        <FontAwesomeIcon className={`commentUserReactionIcon ${userReaction.type === "heart" ? "commentIsSelected" : ""}`} icon={solid("heart")} onClick={() => {handleCommentReactionOnClick("heart")}} />
        <FontAwesomeIcon className={`commentUserReactionIcon ${userReaction.type === "thumbs-up" ? "commentIsSelected" : ""}`} icon={solid("thumbs-up")} onClick={() => {handleCommentReactionOnClick("thumbs-up")}} />
        <FontAwesomeIcon className={`commentUserReactionIcon ${userReaction.type === "face-grin-tears" ? "commentIsSelected" : ""}`} icon={solid("face-grin-tears")} onClick={() => {handleCommentReactionOnClick("face-grin-tears")}} />
        <FontAwesomeIcon className={`commentUserReactionIcon ${userReaction.type === "face-surprise" ? "commentIsSelected" : ""}`} icon={solid("face-surprise")} onClick={() => {handleCommentReactionOnClick("face-surprise")}} />
        <FontAwesomeIcon className={`commentUserReactionIcon ${userReaction.type === "face-angry" ? "commentIsSelected" : ""}`} icon={solid("face-angry")} onClick={() => {handleCommentReactionOnClick("face-angry")}} />
      </div>
      {commentUserData._id !== userData._id && 
      <div className={`commentReport ${isCommentReported === true && "isCommentReported"}`} onClick={handleCommentReportOnClick} >
          <p>R</p>
      </div>}
      {isModifyComment && 
      <ModifyComment commentId={_id} content={commentContent} setIsModifyComment={setIsModifyComment} setCommentContent={setCommentContent} totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} postComments={postComments} setPostComments={setPostComments} />}
      {confirmDeleteComment && 
      <div className="confirmDeleteComment" >
        <p>Confirm deletion : </p>
        <div className="confirmDeleteCommentButtonsContainer" >
          <button onClick={handleDeleteComment} >Yes</button>
          <button onClick={handleCancelDeleteComment}>Cancel</button>
        </div>
      </div>}
    </StyledComment>
  );
}
export default Comment;