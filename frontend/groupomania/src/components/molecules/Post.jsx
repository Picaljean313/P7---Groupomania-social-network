import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import Comment from '../atoms/Comment';
import basePath from '../../utils/basePath';
import { useContext } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";
import React from "react";
import ModifyPost from "../atoms/ModifyPost";

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
margin : 80px;
background-color : yellow;
border-radius : 25px;
display : flex;
flex-direction : column;
align-items: center;

.post {
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

.postUserData {
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

.postUserData p {
  font-size : 20px;
  margin : 0 10px 0 10px;
  color : white;
}

.postUserData img {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.icon {
  font-size : 20px;
  margin : 5px;
}

.icon:hover {
  animation : ${reactionHover} 1000ms linear;
}

.isSelected {
  color : red;
}

.postReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : -10px;
}

.postReaction {
  position : relative;
}

.iconPostReaction {
  margin : 0;
  font-size : 20px;
}

.iconPostReactionBackground {
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

.postReactionNumber {
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

.postReactionNumber p {
  margin : 0;
  color : white;
  font-size : 8px;
}

.postUserReactions {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : 30px;
  bottom : -15px;
}

.changePost {
  position : absolute;
  left : 30px;
  bottom : -15px;
}

.modifyPostButton {
  background-color : white;
  height : 30px;
  border-radius : 15px;
  display : flex;
  justify-content : center;
  align-items : center;
}

.modifyPostButton p {
  margin : 0 15px 0 15px;
}

.modifyPostButton:hover {
  color : green;
}

.deletePostButton {
  position : absolute;
  left : 130px;
  bottom : 0;
  width : 30px;
  height : 30px;
  border-radius : 50%;
  background-color : red;
  display : flex;
  justify-content : center;
  align-items : center;
}

.deletePostButton:hover {
  background-color : green;
}

.crossDeletePostButton {
  color : white;
  font-size : 22px;
}

.confirmDeletePost{
  width : 600px;
  heigth : 100px;
  display : flex;
  justify-content : center;
  align-items : center;
  margin-top: 50px;
}

.confirmDeletePost button{
  margin-left: 30px;
  height : 30px;
}

.createComment {
  margin-top : 50px;
}
`


function Post ({_id, content, imageUrl, postUserData, reactions, comments}) {
  const {token, userData} = useContext(Context);

  const [postContent, setPostContent] = useState(content);
  const [postImageUrl, setPostImageUrl] = useState(imageUrl);

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
  
  return (
    <StyledPost>
      <div className="post" >
        <a className="postUserData" href={`/userProfile/${postUserData._id}`} >
          <img src={postUserData.imageUrl} alt='Avatar'/>
          <p>{postUserData.pseudo}</p>
        </a>
        <div className="postReactions">
          {postReactions.heart !== 0 && (<div className="postReaction">
            <div className="iconPostReactionBackground">
              <FontAwesomeIcon className="iconPostReaction heart" icon={solid("heart")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.heart}</p>
            </div>
          </div>)}
          {postReactions.thumbsUp !== 0 && (<div className="postReaction">
            <div className="iconPostReactionBackground">
              <FontAwesomeIcon className="iconPostReaction thumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.thumbsUp}</p>
            </div>
          </div>)}
          {postReactions.faceGrinTears !== 0 && (<div className="postReaction">
            <div className="iconPostReactionBackground">
              <FontAwesomeIcon className="iconPostReaction faceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {postReactions.faceSurprise !== 0 && (<div className="postReaction">
            <div className="iconPostReactionBackground">
              <FontAwesomeIcon className="iconPostReaction faceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceSurprise}</p>
            </div>
          </div>)}
          {postReactions.faceAngry !== 0 && (<div className="postReaction">
            <div className="iconPostReactionBackground">
            <FontAwesomeIcon className="iconPostReaction faceAngry" icon={solid("face-angry")} />
            </div>
            <div className="postReactionNumber">
              <p>{postReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        {postContent && <p>{postContent}</p>}
        {postImageUrl && <img src={postImageUrl} alt={`Post from ${postUserData.pseudo}`}/>}
        {changePost && (<div className="changePost" >
          <div className="modifyPostButton" onClick={handleModifyPost} >
            <p>Modify post</p>
          </div>
          <div className="deletePostButton" onClick={handleDeletePostButtonOnClick} >
            <FontAwesomeIcon className="crossDeletePostButton" icon={solid("xmark")} />
          </div>
        </div>)}
        <div className="postUserReactions" >
          <FontAwesomeIcon className={`icon ${userReaction.type === "heart" ? "isSelected" : ""}`} icon={solid("heart")} onClick={()=> {handlePostReactionOnClick("heart")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "thumbs-up" ? "isSelected" : ""}`} icon={solid("thumbs-up")} onClick={()=> {handlePostReactionOnClick("thumbs-up")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-grin-tears" ? "isSelected" : ""}`} icon={solid("face-grin-tears")} onClick={()=> {handlePostReactionOnClick("face-grin-tears")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-surprise" ? "isSelected" : ""}`} icon={solid("face-surprise")} onClick={()=> {handlePostReactionOnClick("face-surprise")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-angry" ? "isSelected" : ""}`} icon={solid("face-angry")} onClick={()=> {handlePostReactionOnClick("face-angry")}} />
        </div>
      </div>
      {isModifyPost && 
      <ModifyPost postId={_id} content={postContent} imageUrl={postImageUrl} setIsModifyPost={setIsModifyPost} setPostContent={setPostContent} setPostImageUrl={setPostImageUrl} />}
      {confirmDeletePost && 
      <div className="confirmDeletePost" >
        <p>Confirm post deletion : </p>
        <button onClick={handleDeletePost} >Yes</button>
        <button onClick={handleCancelDeletePost}>No</button>
      </div>}
      <form onSubmit = { handleCommentSubmit } className="createComment" >
        <label htmlFor = "userComment" >Write your comment : </label>
        <textarea id = {`userComment-${_id}`} name = "userComment" type = "text" maxLength = "1000" />
        <button type="submit">Envoyer</button>
      </form>
      <div className="comments" >
        {(Array.isArray(postComments) && postComments.length !== 0) ? postComments.map(e => 
          <Comment key={e._id} _id={e._id} content={e.content} commentUserData={e.userData} reactions={e.reactions} totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} postComments={postComments} setPostComments={setPostComments} commentsLimit={commentsLimit} />
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
    </StyledPost>
  );
}
export default Post;