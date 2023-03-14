import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledProfileOverview = styled.div`
display : flex;
width : 700px;
heigth : 200px;
border : 1px solid green;
justify-content : space-around;
align-items : center;
margin : 20px 0 20px 0;

p {
  margin : 0;
}

.profileOverviewImage {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin : 0 10px 0 0;
}

.profileOverviewActivityContainer {
  display : flex;
  align-items : center;
}

.profileOverviewActivityContainer p {
  margin : 0 30px 0 0;
}
`

function ProfileOverview({_id, pseudo, imageUrl, email, isAdmin, activity}) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/userProfile/${_id}`);
  };
  
  
  return (
    <StyledProfileOverview className = "profileOverview" >
      <img src={imageUrl} alt='Avatar' className = "profileOverviewImage"/>
      <div className="profileOverviewDataContainer" >
        <p>{`Pseudo : ${pseudo}`}</p>
        <p>{`Email : ${email}`}</p>
        <p>{`Status : ${isAdmin ? "Admin" : "Classic user"}`}</p>
      </div>
      <div className="profileOverviewActivityContainer" >
        <p>Activity : </p>
        <div>
          <p>{`${activity.posts} posts`}</p>
          <p>{`${activity.comments} comments`}</p>
          <p>{`${activity.reactions} reactions`}</p>
        </div>
      </div>
      <button onClick={handleOnClick} >Show profile</button>
    </StyledProfileOverview>
  );
}

export default ProfileOverview;