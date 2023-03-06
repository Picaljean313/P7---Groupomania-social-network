import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import {basePath} from '../../utils/pagesData';
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

.icon {
  font-size : 20px;
  margin : 5px;
}

.icon:hover {
  animation : ${reactionHover} 1000ms linear;
}

.commentReaction {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : -15px;
  bottom : -15px;
}
`


function Comment ({_id, content, userData, reactions}) {
  const {token} = useContext(Context);

  let initialUserReaction = "none";

  for (let i in reactions){
    if (reactions[i].userId === userData._id && ["heart", "thumbs-up", "face-grin-tears", "face-surprise", "face-angry"].includes(reactions[i].type)){
      initialUserReaction = {
        type : reactions[i].type,
        _id : reactions[i]._id
      };
    }
  }

  const [userReaction, setUserReaction] = useState (initialUserReaction);

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
        const resJson = await res.json();
        return setUserReaction({
          type : reaction,
          _id : resJson.reactionId
        })
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
        return setUserReaction({
          type : reaction,
          _id : userReaction._id
        });
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
        return setUserReaction("none");
      }
    }
    return console.log("Check onClick");
  };

  const handleOnClick = function () {
    console.log("click")
  };
  
  return (
    <StyledComment>
      <div className="comment">
        <p>{content}</p>
        <div className="commentReaction" >
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