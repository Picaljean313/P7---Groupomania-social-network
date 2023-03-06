import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { keyframes } from "styled-components";

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


function Comment ({content, userData, reactions}) {
  const handleOnClick = function () {
    console.log("click")
  };
  
  return (
    <StyledComment>
      <div className="comment">
        <p>{content}</p>
        <div className="commentReaction" >
          <FontAwesomeIcon className="icon" icon={solid("heart")} onClick={handleOnClick} />
          <FontAwesomeIcon className="icon" icon={solid("thumbs-up")} onClick={handleOnClick} />
          <FontAwesomeIcon className="icon" icon={solid("face-grin-tears")} onClick={handleOnClick} />
          <FontAwesomeIcon className="icon" icon={solid("face-surprise")} onClick={handleOnClick} />
          <FontAwesomeIcon className="icon" icon={solid("face-angry")} onClick={handleOnClick} />
        </div>
      </div>
    </StyledComment>
  );
}
export default Comment;