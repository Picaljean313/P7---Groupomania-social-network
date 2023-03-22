import { useContext } from "react";
import styled from "styled-components";
import basePath from "../../utils/basePath";
import { Context } from "../../utils/Context";

const StyledModifyComment = styled.div `
margin : 80px;
background-color : blue;
`

function ModifyComment ({commentId, content, setIsModifyComment, setCommentContent, totalPostComments, postComments, setTotalPostComments, setPostComments}) {
  const {token} = useContext(Context);

  const handleCancelModifyCommentOnClick = () => {
    setIsModifyComment(false);
  };

  const handleModifyCommentOnSubmit = async function (event) {
    event.preventDefault();

    const newCommentContentValue = document.getElementById(`modifyCommentModifyContent${commentId}`).value;

    if (newCommentContentValue === content || newCommentContentValue.length < 1 || newCommentContentValue.length > 1000 ) return

    const res = await fetch (`${basePath}/comments/${commentId}`, {
      method : "PUT",
      headers : {
        'Accept': 'application/json', 
        'Content-Type': 'application/json', 
        'Authorization' : `Bearer ${token}`
      },
      body : JSON.stringify({content : newCommentContentValue})
    });

    if(res.status === 200) {
      setIsModifyComment(false);
      setCommentContent(newCommentContentValue);


      const newTotalPostComments = [];
      for (let comment of totalPostComments){
        if (comment._id === commentId){
          comment.content = newCommentContentValue;
        }
        newTotalPostComments.push(comment);
      }

      const newPostComments = [];
      for (let comment of postComments){
        if (comment._id === commentId){
          comment.content = newCommentContentValue;
        }
        newPostComments.push(comment);
      }

      setTotalPostComments(newTotalPostComments);
      setPostComments(newPostComments);

      return alert ("Comment modified")
    }
    else console.log("Comment modification failed")
  };

  return (
    <StyledModifyComment>
      <form onSubmit = { handleModifyCommentOnSubmit }>
        <label htmlFor = {`modifyCommentModifyContent${commentId}`} >Modify your content : </label>
        <textarea id = {`modifyCommentModifyContent${commentId}`} type = "text" defaultValue={content} maxLength = "1000" />
        <button type="submit">Envoyer</button>
        <button onClick={handleCancelModifyCommentOnClick} >Cancel</button>
      </form>
    </StyledModifyComment>
  )
};

export default ModifyComment;