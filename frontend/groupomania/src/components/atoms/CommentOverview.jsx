import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledCommentOverview = styled.div`
display : flex;
width : 700px;
height : 100px;
border : 1px solid green;
justify-content : space-around;
align-items : center;
margin : 20px 0 20px 0;

p {
  margin : 0;
}

.commentOverviewContent {
  width : 200px;
  heigth : 60px;
  overflow : scroll;
}

.commentOverviewUserDataContainer {
  display : flex;
}

.commentOverviewUserImage {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.commentOverviewActivityContainer p {
  margin : 0 30px 0 0;
}

.commentOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}
`

function CommentOverview ({commentData, userData}) {
  const navigate = useNavigate();

  const handleShowCommentOnClick = () => {
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${userData._id}`);
  };
  
  
  return (
    <StyledCommentOverview>
      <p className="commentOverviewContent" >{commentData.content}</p>
      <div>
        <p>From : </p>
        <div className="commentOverviewUserDataContainer" >
          <img src={userData.imageUrl} alt='User avatar' className = "commentOverviewUserImage"/>
          <p>{userData.pseudo}</p>
        </div>
      </div>
      <div className="commentOverviewActivityContainer" >
        <p>Activity : </p>
        <p>{`${commentData.reactions.length} reactions`}</p>
      </div>
      <div className="commentOverviewButtonsContainer" >
        <button onClick={handleShowCommentOnClick} >Show post associated</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
    </StyledCommentOverview>
  );
}

export default CommentOverview;