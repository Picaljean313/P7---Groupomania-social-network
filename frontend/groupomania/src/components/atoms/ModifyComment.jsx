import { useContext } from "react";
import styled from "styled-components";
import basePath from "../../utils/basePath";
import { Context } from "../../utils/Context";
import colors from "../../utils/colors";

const StyledModifyComment = styled.div `
width : 318px;
background-color : white;
border : outset 3px ${colors.primary};
border-radius : 20px;
margin-top : 30px;
padding : 20px;

.modifyCommentForm {
  display : flex;
  flex-direction : column;
  align-items: center;
}

.modifyCommentForm label {
  color : #46485b;
  font-size : 16px;
}

.modifyCommentForm textarea {
  min-width : 300px;
  max-width : 300px;
  min-height : 20px;
  max-height : 100px;
  color : #46485b;
  font-size : 14px;
  margin-top : 20px;
}

.modifyCommentButtonsContainer button {
  height : 30px;
  border-radius : 10px;
  width : 80px;
  margin : 20px 10px 0 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

@media screen and (max-width: 519px) {
  width : 80%;
  
  .modifyCommentForm textarea {
    min-width : 90%;
    max-width : 90%;
    max-height : 120px;
  }
  
  .modifyCommentButtonsContainer button {
    height : 25px;
    width : 70px;
    margin : 20px 5px 0 5px;
    font-size : 14px;
  }
}
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
      <form className="modifyCommentForm" onSubmit = { handleModifyCommentOnSubmit }>
        <label htmlFor = {`modifyCommentModifyContent${commentId}`} >Modify your content : </label>
        <textarea id = {`modifyCommentModifyContent${commentId}`} type = "text" defaultValue={content} maxLength = "1000" />
        <div className="modifyCommentButtonsContainer">
          <button type="submit">Modify</button>
          <button onClick={handleCancelModifyCommentOnClick} >Cancel</button>
        </div>
      </form>
    </StyledModifyComment>
  )
};

export default ModifyComment;