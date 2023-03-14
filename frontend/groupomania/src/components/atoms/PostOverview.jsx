import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledPostOverview = styled.div`
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

.postOverviewDataContainer {
  display : flex;
}

.postOverviewContent {
  width : 200px;
  heigth : 60px;
  overflow : scroll;
}

.postOverviewImage {
  height : 60px;
  width : 80px;
  border-radius : 10px;
  margin : 0 10px 0 0;
}

.postOverviewUserDataContainer {
  display : flex;
}

.postOverviewUserImage {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.postOverviewActivityContainer {
}

.postOverviewActivityContainer p {
  margin : 0 30px 0 0;
}

.postOverviewButtonsContainer {
  display : flex;
  flex-direction : column;
}
`

function PostOverview ({postData, userData}) {
  const navigate = useNavigate();

  const handleShowPostOnClick = () => {
  };

  const handleShowUserOnClick = () => {
    navigate(`/userProfile/${userData._id}`);
  };
  
  
  return (
    <StyledPostOverview>
      <div className="postOverviewDataContainer">
        {postData.imageUrl && <img src={postData.imageUrl} alt='Post image' className = "postOverviewImage"/>}
        <p className="postOverviewContent" >{postData.content}</p>
      </div>
      <div>
        <p>From : </p>
        <div className="postOverviewUserDataContainer" >
          <img src={userData.imageUrl} alt='User avatar' className = "postOverviewUserImage"/>
          <p>{userData.pseudo}</p>
        </div>
      </div>
      <div className="postOverviewActivityContainer" >
        <p>Activity : </p>
        <div>
          <p>{`${postData.reactions.length} reactions`}</p>
          <p>{`${postData.comments.length} comments`}</p>
        </div>
      </div>
      <div className="postOverviewButtonsContainer" >
        <button onClick={handleShowPostOnClick} >Show post</button>
        <button onClick={handleShowUserOnClick} >Show user</button>
      </div>
    </StyledPostOverview>
  );
}

export default PostOverview;