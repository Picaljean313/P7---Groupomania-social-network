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
  height : 80px;
  margin-right : 20px;
}

.profileOverviewDataContainer {
  display : flex;
  flex: 1;
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

.profileOverviewUserDataContainer {
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

.profileOverviewUserDataContainer p {
  margin : 0;
  color : ${colors.tertiary};
  max-width : 220px;
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

@media screen and (max-width: 749px) {
  width : 80%;
}

@media screen and (min-width: 650px) and (max-width: 749px) {
  .profileOverviewContainer {
    height : auto;
    flex-direction : column;
    align-items : center;
  }
  
  .profileOverviewDataContainer {
    margin-top : 10px;
  }
  
  .profileOverviewButton {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
  
  .profileOverviewContainer img {
    height : 100px;
    width : 130px;
  }
  
  .profileOverviewUserDataContainer {
    margin : 0 10px 0 0;
  }
  
  .profileOverviewUserDataContainer p {
    max-width : 200px;
  }
}

@media screen and (min-width: 450px) and (max-width: 649px) {
  .profileOverviewContainer {
    height : auto;
    flex-direction : column;
    align-items : center;
  }
  
  .profileOverviewDataContainer {
    flex-direction : column;
    margin-top : 10px;
  }
  
  .profileOverviewButton {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
  
  .profileOverviewContainer img {
    height : 90px;
    width : 110px;
  }
  
  .profileOverviewUserDataContainer {
    margin : 0 10px 0 0;
  }
  
  .profileOverviewUserDataContainer p {
    max-width : 200px;
    margin : 2px 0 2px 0;
  }

  .profileOverviewActivityContainer p {
    margin : 2px 0 2px 0;
  }
}

@media screen and (max-width: 449px) {
  flex-direction : column;

  .profileOverviewContainer {
    width : 90%;
    margin : 0 0 20px 0;
    height : auto;
    flex-direction : column;
    align-items : center;
  }
  
  .profileOverviewDataContainer {
    flex-direction : column;
    margin-top : 10px;
  }
  
  .profileOverviewButton {
    height : 25px;
    width : 100px;
    font-size : 14px;
  }
  
  .profileOverviewContainer img {
    height : 90px;
    width : 110px;
  }
  
  .profileOverviewUserDataContainer {
    margin : 0 10px 0 0;
  }
  
  .profileOverviewUserDataContainer p {
    max-width : 200px;
    margin : 2px 0 2px 0;
  }

  .profileOverviewActivityContainer p {
    margin : 2px 0 2px 0;
  }
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
        <div className="profileOverviewDataContainer">
          <div className="profileOverviewUserDataContainer" >
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
      </div>
      <button className="profileOverviewButton" onClick={handleOnClick} >Show profile</button>
    </StyledProfileOverview>
  );
}

export default ProfileOverview;