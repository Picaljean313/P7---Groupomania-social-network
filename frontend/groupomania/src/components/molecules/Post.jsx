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

  const commmentsLimit = 2;

  const initialIsMoreCommentsToShow = comments.length > commmentsLimit;
  const [isMoreCommentsToShow, setIsMoreCommentsToShow] = useState (initialIsMoreCommentsToShow);

  let initialPostComments = [];
  if (comments.length > commmentsLimit) {
    let i = 0;
    while (i < commmentsLimit) {
      initialPostComments.push(comments[i]);
      i++;
    }
  } else {
    initialPostComments = comments;
  }
  const [postComments, setPostComments] = useState(initialPostComments);

  const [totalPostComments, setTotalPostComments] = useState(comments);

  const handleMoreCommentsOnClick = () => {
    const newPostComments = [];
    let i = 0;
    while (i < postComments.length + commmentsLimit && i < totalPostComments.length){
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
    while (i < commmentsLimit) {
      newPostComments.push(totalPostComments[i]);
      i++;
    }
    setPostComments(newPostComments);
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
        {Array.isArray(postComments) && postComments.map(e => 
          <Comment key={e._id} _id={e._id} content={e.content} commentUserData={e.userData} reactions={e.reactions} totalPostComments={totalPostComments} setTotalPostComments={setTotalPostComments} />
        )}
        <div>
          {isMoreCommentsToShow ?
          <button onClick={handleMoreCommentsOnClick}>
            View older comments
          </button> : 
          <p>No more comments to show</p>}
          {(postComments.length > commmentsLimit) && 
          <button onClick={handleHideCommentsOnClick}>
            Hide extra comments 
          </button>}
        </div>
      </div>
      <form onSubmit = { handleCommentSubmit }>
        <label htmlFor = "userComment" >Write your comment : </label>
        <textarea id = {`userComment-${_id}`} name = "userComment" type = "text" maxLength = "1000" />
        <button type="submit">Envoyer</button>
      </form>
    </StyledPost>
  );
}
export default Post;