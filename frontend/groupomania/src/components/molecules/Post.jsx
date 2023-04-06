import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import Comment from '../atoms/Comment';
import basePath from '../../utils/basePath';
import { useContext, useEffect } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";
import React from "react";
import ModifyPost from "../atoms/ModifyPost";
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

const StyledPost = styled.div `
margin-top : 60px;
width : 490px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
display : flex;
flex-direction : column;
align-items: center;

.post {
  position : relative;
  width : 100%;
  display : flex;
  flex-direction :column;
  align-items : center;
}

.postImageWithContent {
  width : 444px;
  height : 297px;
  object-fit : cover;
  border-radius : 0 0 10px 10px;
  border-right : outset 3px white;
  border-bottom : outset 3px white;
  border-left : outset 3px white;
}

.postImageWithoutContent {
  width : 450px;
  height : 300px;
  object-fit : cover;
  border-radius : 10px;
  margin-top : 30px;
}

.postContentWithImage {
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

.postContentWithoutImage {
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

.postUserData {
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

.postUserData p {
  max-width : 90px;
  overflow : hidden;
  text-overflow : ellipsis;
  font-size : 14px;
  margin : 0 10px 0 10px;
  color : #46485b;
}

.postUserData img {
  height : 24px;
  width : 24px;
  border-radius : 50%;
}

.postUserReactions {
  border : outset 2px ${colors.secondary};
  background-color : #ffebeb;
  padding : 0 2px 0 2px;
  border-radius : 15px;
  position : absolute;
  right : 30px;
  bottom : -15px;
}

.postUserReactionsIcon {
  color : #46485b;
  font-size : 18px;
  margin : 4px 2px 4px 2px;
  vertical-align : -3.5px;
}

.postReport {
  border : outset 2px ${colors.secondary};
  background-color : #ffebeb;
  height : 26px;
  width : 26px;
  border-radius : 15px;
  position : absolute;
  right : 180px;
  bottom : -15px;
  display : flex;
  justify-content : center;
  align-items : center;
  cursor : pointer;
  color : ${colors.tertiary};
  font-size : 14px;
}

.postReport p {
  margin : 0;
}

.isPostReported {
  background-color : white;
  border : outset 3px ${colors.primary};
  color : ${colors.primary};
  font-size : 20px;
  width: 36px;
  height : 36px;
  bottom : -21px;
  right : 175px;
  border-radius : 21px;
}

.postReactionIsSelected {
  color : green;
}

.postReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : 35px;
}

.postReaction {
  position : relative;
  margin-right : -10px;
}

.postHeartPosition {
  z-index : 5;
}

.postThumbsUpPosition {
  z-index : 4;
}

.postFaceGrinTearsPosition {
  z-index : 3;
}

.postFaceSurprisePosition {
  z-index : 2;
}

.postFaceAngryPosition {
  z-index : 1;
}

.postReactionIcon {
  margin : 0;
  font-size : 20px;
}

.postReactionIconBackground {
  height : 28px;
  width : 28px;
  border-radius : 50%;
  border : outset 1px white;
  background-color : white;
  display : flex;
  justify-content : center;
  align-items : center;
}

.postHeart {
  color : ${colors.primary};
}

.postThumbsUp {
  color : blue;
}

.postFaceGrinTears {
  color : #f5a742;
}

.postFaceSurprise {
  color : #f5a742;
}

.postFaceAngry {
  color : #f56042;
}

.postReactionNumber {
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

.postReactionNumber p {
  margin : 0;
  color : white;
  font-size : 8px;
}

.changePost {
  position : absolute;
  left : 30px;
  bottom : -13px;
  display : flex;
}

.modifyPostButton {
  background-color : #ffebeb;
  border : outset 2px ${colors.secondary};
  cursor : pointer;
  height : 22px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyPostButton p {
  color : #46485b;
  margin : 0 13px 0 13px;
  font-size: 16px;
}

.deletePostButton {
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

.crossDeletePostButton {
  color : white;
  font-size : 22px;
}

.postConfirmDeletePost{
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 30px;
  padding : 20px;
  border-radius : 20px;
  background-color : white;
  border : outset 3px ${colors.primary};
}

.postConfirmDeletePost p {
  margin : 0;
  font-size : 20px;
  color : #46485b;
}

.postConfirmDeletePost button{
  cursor : pointer;
  color : #46485b;
  border : outset 2px ${colors.primary};
  border-radius : 5px;
  margin-left: 20px;
  height : 30px;
}

.postCreateComment {
  margin-top : 40px;
  width : 404px;
  display : flex;
  align-items : center;
  padding : 20px;
  background-color : #ececf0;
  border-radius : 10px;
  border: outset 3px #ececf0;
}

.postCreateCommentInput {
  display : flex;
  align-items : center;
}

.postCreateComment label {
  display : block;
  margin-right : 15px;
  font-size : 16px;
  color : #46485b;
}

.postCreateComment textarea {
  flex :1;
  min-height : 20px;
  max-height : 150px;
  max-width : 210px;
  font-size : 14px;
  color : ${colors.tertiary};
}

.postCreateComment button {
  height : 30px;
  border-radius : 10px;
  width : 80px;
  margin-left : 15px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

.postComments {
  margin : 30px 0 20px 0;
  width : 404px;
  padding : 20px;
  display : flex;
  flex-direction : column;
  align-items : center;
  background-color : #ececf0;
  border-radius : 10px;
  border: outset 3px #ececf0;
}

.postNoCommentsToShow {
  cursor : default;
  text-align : center;
  color : #46485b;
  margin : 0;
  font-size : 18px;
}

.postHandleCommentsButton {
  height : 30px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
  margin : 20px;
}

@media screen and (min-width: 520px) {
  .postUserReactionsIcon:hover {
    cursor : pointer;
    animation : ${reactionHover} 1000ms linear;
  }
}

@media screen and (max-width: 519px) {
  width : 100%;

  .postImageWithContent {
    width : 90%;
  }
  
  .postImageWithoutContent {
    width : 90%;
  }
  
  .postContentWithImage {
    width : 90%;
    padding : 10px 0 10px 0;
    font-size : 18px;
  }
  
  .postContentWithoutImage {
    width : 90%;
    padding : 10px 0 10px 0;
    font-size : 18px;
  }

  .postComments {
    width : 90%;
    padding : 20px 0 20px 0;
  }

  .postCreateComment {
    width : 90%;
    padding : 20px 0 20px 0;
    flex-direction : column;
  }
  
  .postCreateComment textarea {
    max-height : 120px;
    max-width : 160px;
  }
  
  .postCreateComment button {
    margin-top : 15px;
    font-size : 14px;
    height : 25px;
  }

  .postNoCommentsToShow {
    font-size : 16px;
  }

  .postUserReactions {
    border-radius : 12px;
    right : 25px;
    bottom : -12px;
  }

  .postUserReactionsIcon {
    font-size : 14px;
    margin : 2px 1px 2px 1px;
    vertical-align : -2.5px;
  }

  .postReport {
    height : 20px;
    width : 20px;
    border-radius : 12px;
    right : 125px;
    bottom : -12px;
    font-size : 12px;
  }
  
  .isPostReported {
    border : outset 2px ${colors.primary};
    font-size : 14px;
    width: 26px;
    height : 26px;
    bottom : -15px;
    right : 125px;
    border-radius : 15px;
  }

  .changePost {
    left : 25px;
    bottom : -12px;
  }

  .modifyPostButton {
    cursor : pointer;
    height : 20px;
    border-radius : 12px;
  }

  .modifyPostButton p {
    margin : 0 10px 0 10px;
    font-size: 14px;
  }

  .deletePostButton {
    margin-left : 10px;
    width : 20px;
    height : 20px;
    border : outset 2px ${colors.primary};
  }

  .crossDeletePostButton {
    font-size : 20px;
  }

  .postConfirmDeletePost{
    width : 90%;
    padding : 0;
    border-radius : 20px;
    background-color : white;
    border : outset 3px ${colors.primary};
  }
  
  .postConfirmDeletePost p {
    margin : 20px 0 20px 20px;
    font-size : 18px;
  }
  
  .postConfirmDeletePost button{
    margin: 10px;
  }

  .postReactionIcon {
    font-size : 16px;
  }
  
  .postReactionIconBackground {
    height : 24px;
    width : 24px;
  }
}

@media screen and (min-width: 450px) and (max-width: 519px) {
  .postImageWithContent {
    height : 247px;
  }
  
  .postImageWithoutContent {
    height : 250px;
  }
}

@media screen and (max-width: 449px) {
  .postImageWithContent {
    height : 197px;
  }
  
  .postImageWithoutContent {
    height : 200px;
  }
}
`


function Post ({_id, content, imageUrl, postUserData, reactions, comments}) {
  const {token, userData} = useContext(Context);

  const [postContent, setPostContent] = useState(content);
  const [postImageUrl, setPostImageUrl] = useState(imageUrl);
  const [isPostReported, setIsPostReported] = useState(false);
  const [reportId, setReportId] = useState("none");

  let initialUserReaction = "none";

  for (let i in reactions){
    if (reactions[i].userId === userData._id && ["heart", "thumbs-up", "face-grin-tears", "face-surprise", "face-angry"].includes(reactions[i].type)){
      initialUserReaction = reactions[i];
    }
  }

  const [userReaction, setUserReaction] = useState (initialUserReaction);

  const initialPostReactions = {
    heart : 0,
    thumbsUp : 0,
    faceGrinTears : 0,
    faceSurprise : 0,
    faceAngry : 0
  };

  for (let reaction of reactions){
    if (reaction.type === "heart"){
      initialPostReactions.heart ++;
    }
    if (reaction.type === "thumbs-up"){
      initialPostReactions.thumbsUp ++;
    }
    if (reaction.type === "face-grin-tears"){
      initialPostReactions.faceGrinTears ++;
    }
    if (reaction.type === "face-surprise"){
      initialPostReactions.faceSurprise ++;
    }
    if (reaction.type === "face-angry"){
      initialPostReactions.faceAngry ++;
    }
  };

  const [postReactions, setPostReactions] = useState(initialPostReactions);

  const handlePostReactionOnClick = async function (reaction) {
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
          postId : _id
        })
      });
      if (res.status === 200 || res.status === 201){
        const apiReaction = await res.json();

        const newPostReactions = {}; 
        for (let key of Object.keys(postReactions)){
          newPostReactions[key]= postReactions[key];
        }
        switch (reaction){
          case "heart" : newPostReactions.heart++;
          break;
          case "thumbs-up" : newPostReactions.thumbsUp++;
          break;
          case "face-grin-tears" : newPostReactions.faceGrinTears++;
          break;
          case "face-surprise" : newPostReactions.faceSurprise++;
          break;
          case "face-angry" : newPostReactions.faceAngry++;
          break;
          default : console.log("Can't add user reaction");
        }
        setPostReactions(newPostReactions);

        return setUserReaction(apiReaction.reaction);
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

        const newPostReactions = {}; 
        for (let key of Object.keys(postReactions)){
          newPostReactions[key]= postReactions[key];
        }
        switch (userReaction.type){
          case "heart" : newPostReactions.heart--;
          break;
          case "thumbs-up" : newPostReactions.thumbsUp--;
          break;
          case "face-grin-tears" : newPostReactions.faceGrinTears--;
          break;
          case "face-surprise" : newPostReactions.faceSurprise--;
          break;
          case "face-angry" : newPostReactions.faceAngry--;
          break;
          default : console.log("Can't remove user reaction");
        }
        switch (reaction){
          case "heart" : newPostReactions.heart++;
          break;
          case "thumbs-up" : newPostReactions.thumbsUp++;
          break;
          case "face-grin-tears" : newPostReactions.faceGrinTears++;
          break;
          case "face-surprise" : newPostReactions.faceSurprise++;
          break;
          case "face-angry" : newPostReactions.faceAngry++;
          break;
          default : console.log("Can't add user reaction");
        }
        setPostReactions(newPostReactions);

        const newUserReaction = {};
        for (let key of Object.keys(userReaction)){
          newUserReaction[key] = userReaction[key];
        }
        newUserReaction.type = reaction;

        return setUserReaction(newUserReaction);
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
        const newPostReactions = {}; 
        for (let key of Object.keys(postReactions)){
          newPostReactions[key]= postReactions[key];
        }
        switch (reaction){
          case "heart" : newPostReactions.heart--;
          break;
          case "thumbs-up" : newPostReactions.thumbsUp--;
          break;
          case "face-grin-tears" : newPostReactions.faceGrinTears--;
          break;
          case "face-surprise" : newPostReactions.faceSurprise--;
          break;
          case "face-angry" : newPostReactions.faceAngry--;
          break;
          default : console.log("Can't remove user reaction");
        }
        setPostReactions(newPostReactions);

        return setUserReaction("none");
      }
    }
    return console.log("Check onClick");
  };

  const commentsLimit = 2;

  const [totalPostComments, setTotalPostComments] = useState(comments);

  const initialIsMoreCommentsToShow = totalPostComments.length > commentsLimit;
  const [isMoreCommentsToShow, setIsMoreCommentsToShow] = useState (initialIsMoreCommentsToShow);

  let initialPostComments = [];
  if (totalPostComments.length > commentsLimit) {
    let i = 0;
    while (i < commentsLimit) {
      initialPostComments.push(totalPostComments[i]);
      i++;
    }
  } else {
    initialPostComments = totalPostComments;
  }
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

  const handleCommentSubmit = async function (event) {
    event.preventDefault();

    const value = document.getElementById(`userComment-${_id}`).value;

    if (value.length > 1 && value.length < 1000){
      const res = await fetch(`${basePath}/comments`, {
        method : "POST",
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}` 
          },
        body : JSON.stringify({
          content : value,
          postId : _id
        })
      });
      if (res.status === 200 || res.status === 201){
        const apiData = await res.json();
        const newComment = apiData.comment;
        newComment["reactions"] = [];
        newComment["userData"] = userData;

        const newPostComments = [newComment];
        for (let i in postComments){
          newPostComments.push(postComments[i]);
        }
        const newTotalPostComments = [newComment];
        for (let i in totalPostComments){
          newTotalPostComments.push(totalPostComments[i]);
        }
        setTotalPostComments(newTotalPostComments);
        setPostComments(newPostComments);
        document.getElementById(`userComment-${_id}`).value = "";
      } else {
        console.log("Can't post comment");
      }
    }
    else return
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

  const changePost = (userData._id === postUserData._id || userData.isAdmin); 
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
    const res = await fetch(`${basePath}/posts/${_id}`, {
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

  const hasUserReportedPost = async function () {
    const res = await fetch(`${basePath}/reports?fromUserId=${userData._id}&fromPostId=${_id}`, {
      method : "GET",
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      const resJson = await res.json();
      if (resJson.length === 1){
        setIsPostReported(true);
        setReportId(resJson[0]._id);
      }
    }
  };

  useEffect(()=> {
    if (postUserData._id !== userData._id) {
      hasUserReportedPost();
    }
  },[]);

  const handlePostReportOnClick = async function () {
    if (isPostReported === false) {
      const res = await fetch (`${basePath}/reports`, {
        method : "POST",
        headers : {
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({postId : _id })
      });

      if (res.status === 200 || res.status === 201) {
        const resJson = await res.json();
        const report = resJson.report;
        setReportId(report._id);
        setIsPostReported(true);
        return alert("Post reported. Click once more to cancel report")
      } else {
        return console.log("Report failed")
      }
    }

    if (isPostReported === true) {
      if (reportId === "none") return console.log("Report deletion failed")

      const res = await fetch (`${basePath}/reports/${reportId}`, {
        method : "DELETE",
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        setReportId("none");
        setIsPostReported(false);
        return alert("Post report canceled")
      } else {
        return console.log("Report deletion failed")
      }
    }
  };
  
  return (
    <StyledPost>
      <div className="post" >
        <a className="postUserData" href={postUserData._id !== userData._id ? `/userProfile/${postUserData._id}` : '/myProfile'} >
          <img src={postUserData.imageUrl} alt='Avatar'/>
          <p>{postUserData.pseudo}</p>
        </a>
        <div className="postReactions">
          {postReactions.heart !== 0 && (<div className="postReaction postHeartPosition">
            <div className="postReactionIconBackground">
              <FontAwesomeIcon className="postReactionIcon postHeart" icon={solid("heart")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.heart}</p>
            </div>
          </div>)}
          {postReactions.thumbsUp !== 0 && (<div className="postReaction postThumbsUpPosition">
            <div className="postReactionIconBackground">
              <FontAwesomeIcon className="postReactionIcon postThumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.thumbsUp}</p>
            </div>
          </div>)}
          {postReactions.faceGrinTears !== 0 && (<div className="postReaction postFaceGrinTearsPosition">
            <div className="postReactionIconBackground">
              <FontAwesomeIcon className="postReactionIcon postFaceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {postReactions.faceSurprise !== 0 && (<div className="postReaction postFaceSurprisePosition">
            <div className="postReactionIconBackground">
              <FontAwesomeIcon className="postReactionIcon postFaceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceSurprise}</p>
            </div>
          </div>)}
          {postReactions.faceAngry !== 0 && (<div className="postReaction postFaceAngryPosition">
            <div className="postReactionIconBackground">
            <FontAwesomeIcon className="postReactionIcon postFaceAngry" icon={solid("face-angry")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        {postContent && (postImageUrl ? <p className="postContentWithImage">{postContent}</p> : <p className="postContentWithoutImage">{postContent}</p>)}
        {postImageUrl && (postContent ? <img className="postImageWithContent" src={postImageUrl} alt={`Post from ${postUserData.pseudo}`}/> : <img className="postImageWithoutContent" src={postImageUrl} alt={`Post from ${postUserData.pseudo}`}/>)}
        {changePost && (<div className="changePost" >
          <div className="modifyPostButton" onClick={handleModifyPost} >
            <p>Modify</p>
          </div>
          <div className="deletePostButton" onClick={handleDeletePostButtonOnClick} >
            <FontAwesomeIcon className="crossDeletePostButton" icon={solid("xmark")} />
          </div>
        </div>)}
        <div className="postUserReactions" >
          <FontAwesomeIcon className={`postUserReactionsIcon ${userReaction.type === "heart" ? "postReactionIsSelected" : ""}`} icon={solid("heart")} onClick={()=> {handlePostReactionOnClick("heart")}} />
          <FontAwesomeIcon className={`postUserReactionsIcon ${userReaction.type === "thumbs-up" ? "postReactionIsSelected" : ""}`} icon={solid("thumbs-up")} onClick={()=> {handlePostReactionOnClick("thumbs-up")}} />
          <FontAwesomeIcon className={`postUserReactionsIcon ${userReaction.type === "face-grin-tears" ? "postReactionIsSelected" : ""}`} icon={solid("face-grin-tears")} onClick={()=> {handlePostReactionOnClick("face-grin-tears")}} />
          <FontAwesomeIcon className={`postUserReactionsIcon ${userReaction.type === "face-surprise" ? "postReactionIsSelected" : ""}`} icon={solid("face-surprise")} onClick={()=> {handlePostReactionOnClick("face-surprise")}} />
          <FontAwesomeIcon className={`postUserReactionsIcon ${userReaction.type === "face-angry" ? "postReactionIsSelected" : ""}`} icon={solid("face-angry")} onClick={()=> {handlePostReactionOnClick("face-angry")}} />
        </div>
        {postUserData._id !== userData._id && 
        <div className={`postReport ${isPostReported === true && "isPostReported"}`} onClick={handlePostReportOnClick} >
            <p>R</p>
        </div>}
      </div>
      {isModifyPost && 
      <ModifyPost postId={_id} content={postContent} imageUrl={postImageUrl} setIsModifyPost={setIsModifyPost} setPostContent={setPostContent} setPostImageUrl={setPostImageUrl} />}
      {confirmDeletePost && 
      <div className="postConfirmDeletePost" >
        <p>Confirm deletion : </p>
        <button onClick={handleDeletePost} >Yes</button>
        <button onClick={handleCancelDeletePost}>Cancel</button>
      </div>}
      <form onSubmit = { handleCommentSubmit } className="postCreateComment" >
        <div className="postCreateCommentInput">
          <label htmlFor = {`userComment-${_id}`} >Comment : </label>
          <textarea id = {`userComment-${_id}`} type = "text" maxLength = "1000" />
        </div>
        <button type="submit">Send</button>
      </form>
      <div className="postComments" >
        {(Array.isArray(postComments) && postComments.length !== 0) ? postComments.map(e => 
          <Comment key={e._id} _id={e._id} content={e.content} commentUserData={e.userData} reactions={e.reactions} totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} postComments={postComments} setPostComments={setPostComments} commentsLimit={commentsLimit} />
        ) : <p className="postNoCommentsToShow" >No comments to show</p>}
        {(Array.isArray(postComments) && postComments.length !== 0) && (isMoreCommentsToShow ?
        <button className="postHandleCommentsButton" onClick={handleMoreCommentsOnClick}>
          View more comments
        </button> : 
        <p className="postNoCommentsToShow" >No more comments to show</p>)}
        {(postComments.length > commentsLimit) && 
        <button className="postHandleCommentsButton" onClick={handleHideCommentsOnClick}>
          Hide extra comments 
        </button>}
      </div>
    </StyledPost>
  );
}
export default Post;