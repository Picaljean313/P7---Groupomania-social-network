import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from '../../utils/colors';

const StyledProfileOverview = styled.div`
margin : 20px 0 20px 0;
width : 660px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;
border-radius : 25px;
padding : 20px;
display : flex;
align-items : center;

.profileOverviewContainer {
  display : flex;
  flex :1;
  background-color : #ececf0;
  border : outset 2px #ececf0;
  padding : 10px;
  border-radius : 10px;
  width : 500px;
  height : 80px;
  margin-right : 20px;
}

.profileOverviewButton {
  height : 30px;
  width : 120px;
  border-radius : 10px;
  background-color :  white;
  font-size : 16px;
  color : ${colors.primary};
  border-color : ${colors.primary}; 
  cursor : pointer;
}

.profileOverviewContainer img {
  height : 80px;
  width : 80px;
  object-fit : cover;
  border-radius : 10px;
}

.profileOverviewDataContainer {
  margin : 0 10px 0 10px;
  display : flex;
  flex-direction : column;
  justify-content : space-around;
  flex : 1;
  overflow : hidden;
}

.profileOverviewActivityContainer {
  display : flex;
  align-items : center;
  justify-content : space-between;
  width : 160px;
}

.profileOverviewDataContainer p {
  margin : 0;
  color : ${colors.tertiary};
  max-width : 100%;
  overflow : hidden;
  text-overflow : ellipsis;
  white-space : nowrap;
  cursor : default;
}

.profileOverviewActivityLabel {
  margin : 0 20px 0 0;
  color : ${colors.tertiary};
  cursor : default;
}

.profileOverviewActivityContainer p {
  margin : 0;
  color : ${colors.tertiary};
  cursor : default;
}
`

function ProfileOverview({_id, pseudo, imageUrl, email, isAdmin, activity}) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/userProfile/${_id}`);
  };
  
  
  return (
    <StyledProfileOverview >
      <div className = "profileOverviewContainer">
        <img src={imageUrl} alt='Avatar'/>
        <div className="profileOverviewDataContainer" >
          <p>{`Pseudo : ${pseudo}`}</p>
          <p>{`Email : ${email}`}</p>
          <p>{`Status : ${isAdmin ? "Admin" : "Classic user"}`}</p>
        </div>
        <div className="profileOverviewActivityContainer" >
          <p className="profileOverviewActivityLabel">Activity : </p>
          <div>
            <p>{`${activity.posts} posts`}</p>
            <p>{`${activity.comments} comments`}</p>
            <p>{`${activity.reactions} reactions`}</p>
          </div>
        </div>
      </div>
      <button className="profileOverviewButton" onClick={handleOnClick} >Show profile</button>
    </StyledProfileOverview>
  );
}

export default ProfileOverview;