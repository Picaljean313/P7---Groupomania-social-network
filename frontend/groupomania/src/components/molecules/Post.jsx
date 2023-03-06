import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";
import Comment from '../atoms/Comment';
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

const StyledPost = styled.div `
margin : 80px;
background-color : yellow;
border-radius : 25px;

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

.postReaction {
  background-color : white;
  border-radius : 15px;
  position : absolute;
  right : -15px;
  bottom : -15px;
}
`


function Post ({_id, content, imageUrl, userData, reactions, comments}) {
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

  const isMoreCommentsToShow = false;

  const handleMoreCommentsOnClick = () => {

  };
  
  return (
    <StyledPost>
      <div className="post" >
        <p>{content}</p>
        {imageUrl && <img src={imageUrl} alt={`Post from ${userData.pseudo}`}/>}
        <div className="postReaction" >
          <FontAwesomeIcon className={`icon ${userReaction.type === "heart" ? "isSelected" : ""}`} icon={solid("heart")} onClick={()=> {handlePostReactionOnClick("heart")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "thumbs-up" ? "isSelected" : ""}`} icon={solid("thumbs-up")} onClick={()=> {handlePostReactionOnClick("thumbs-up")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-grin-tears" ? "isSelected" : ""}`} icon={solid("face-grin-tears")} onClick={()=> {handlePostReactionOnClick("face-grin-tears")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-surprise" ? "isSelected" : ""}`} icon={solid("face-surprise")} onClick={()=> {handlePostReactionOnClick("face-surprise")}} />
          <FontAwesomeIcon className={`icon ${userReaction.type === "face-angry" ? "isSelected" : ""}`} icon={solid("face-angry")} onClick={()=> {handlePostReactionOnClick("face-angry")}} />
        </div>
      </div>
      <div className="comments" >
        {Array.isArray(comments) && comments.map(e => 
          <Comment key={e._id} _id={e._id} content={e.content} userData={e.userData} reactions={e.reactions} />
        )}
        {isMoreCommentsToShow ?
        <button onClick={handleMoreCommentsOnClick}>
          View more comments
        </button> : 
        <p>No more comments to show</p>}
      </div>
    </StyledPost>
  );
}
export default Post;