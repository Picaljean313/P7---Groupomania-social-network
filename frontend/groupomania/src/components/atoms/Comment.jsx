import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import basePath from '../../utils/basePath';
import { useContext } from "react";
import { Context } from "../../utils/Context";
import { useState } from "react";

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
margin : 80px;
background-color : blue;

.comment {
  position : relative;
  width : 500px;
  border-radius : 25px 25px 0 0;
  display : flex;
  flex-direction :column;
  justify-content : center;
  align-items : center;
}

.commentUserData {
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

.commentUserData p {
  font-size : 10px;
  margin : 0 5px 0 5px;
  color : white;
}

.commentUserData img {
  height : 20px;
  width : 20px;
  border-radius : 50%;
  margin : 0 5px 0 0;
}

.icon {
  font-size : 20px;
  margin : 5px;
}

.icon:hover {
  animation : ${reactionHover} 1000ms linear;
}

.commentReactions {
  display : flex;
  position : absolute;
  top : -15px;
  right : -10px;
}

.commentReaction {
  position : relative;
}

.iconCommentReaction {
  margin : 0;
  font-size : 20px;
}

.iconCommentReactionBackground {
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

.commentUserReaction {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : -15px;
  bottom : -15px;
}
`


function Comment ({_id, content, commentUserData, reactions, totalPostComments, setTotalPostComments}) {
  const {token, userData} = useContext(Context);

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
  
  return (
    <StyledComment>
      <div className="comment">
        <div className="commentUserData">
          <img src={commentUserData.imageUrl} alt='Avatar'/>
          <p>{commentUserData.pseudo}</p>
        </div>
        <div className="commentReactions">
          {commentReactions.heart !== 0 && (<div className="commentReaction">
            <div className="iconCommentReactionBackground">
              <FontAwesomeIcon className="iconCommentReaction heart" icon={solid("heart")} />
            </div>
            <div className="commentReactionNumber">
              <p>{commentReactions.heart}</p>
            </div>
          </div>)}
          {commentReactions.thumbsUp !== 0 && (<div className="commentReaction">
            <div className="iconCommentReactionBackground">
              <FontAwesomeIcon className="iconCommentReaction thumbsUp" icon={solid("thumbs-up")} />
            </div>
            <div className="commentReactionNumber">
              <p>{commentReactions.thumbsUp}</p>
            </div>
          </div>)}
          {commentReactions.faceGrinTears !== 0 && (<div className="commentReaction">
            <div className="iconCommentReactionBackground">
              <FontAwesomeIcon className="iconCommentReaction faceGrinTears" icon={solid("face-grin-tears")} />
            </div>
            <div className="commentReactionNumber">
              <p>{commentReactions.faceGrinTears}</p>
            </div>
          </div>)}
          {commentReactions.faceSurprise !== 0 && (<div className="commentReaction">
            <div className="iconCommentReactionBackground">
              <FontAwesomeIcon className="iconCommentReaction faceSurprise" icon={solid("face-surprise")} />
            </div>
            <div className="commentReactionNumber">
              <p>{commentReactions.faceSurprise}</p>
            </div>
          </div>)}
          {commentReactions.faceAngry !== 0 && (<div className="commentReaction">
            <div className="iconCommentReactionBackground">
            <FontAwesomeIcon className="iconCommentReaction faceAngry" icon={solid("face-angry")} />
            </div>
            <div className="commentReactionNumber">
              <p>{commentReactions.faceAngry}</p>
            </div>
          </div>)}
        </div>
        <p>{content}</p>
        <div className="commentUserReaction" >
          <FontAwesomeIcon className={`icon ${userReaction.type === "heart" ? "isSelected" : ""}`} icon={solid("heart")} onClick={() => {handleCommentReactionOnClick("heart")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "thumbs-up" ? "isSelected" : ""}`} icon={solid("thumbs-up")} onClick={() => {handleCommentReactionOnClick("thumbs-up")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-grin-tears" ? "isSelected" : ""}`} icon={solid("face-grin-tears")} onClick={() => {handleCommentReactionOnClick("face-grin-tears")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-surprise" ? "isSelected" : ""}`} icon={solid("face-surprise")} onClick={() => {handleCommentReactionOnClick("face-surprise")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-angry" ? "isSelected" : ""}`} icon={solid("face-angry")} onClick={() => {handleCommentReactionOnClick("face-angry")}} />
        </div>
      </div>
    </StyledComment>
  );
}
export default Comment;