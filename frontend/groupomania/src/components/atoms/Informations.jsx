import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../../utils/Context";
import colors from "../../utils/colors";

const StyledInformations = styled.div`
position : absolute;
z-index : 1;
left : 0;
top:0;
display : flex;
flex-direction: column;
align-items : center;
justify-content : center;
width : 220px;
border-radius : 20px;
margin : 10px;
background-color : ${colors.tertiary};
box-shadow : 10px 5px 2px #46485b;

.logo {
  width: 200px;
  height: 45px;
  object-fit : cover;
}

.informationUser {
  display : flex;
  justify-content : center;
  align-items : center;
  width: 200px;
  height: 45px;
}

.informationUser p {
  cursor : default;
  max-width : 150px;
  overflow : hidden;
  text-overflow : ellipsis;
  font-size : 18px;
  color : ${colors.secondary};
  margin-left : 10px;
}

.avatar {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin-right : 10px;
}

@media screen and (min-width : 600px) and (max-width : 849px) {
  left : 50px;
}

@media screen and (max-width : 599px) {
  width : 200px;
  
  .informationUser p {
    max-width : 140px;
  }
  
  .avatar {
    height : 30px;
    width : 30px;
    border-radius : 50%;
    margin-right : 10px;
  }
}
`

function Informations() {
  const {userData} = useContext(Context);
  const imageUrl = userData.imageUrl;
  const pseudo = userData.pseudo;

  return (
    <StyledInformations>
      <img src={'/images/logo/logo.svg'} alt='Groupomania logo' className = "logo"/>
      {userData !== "none" && <div className="informationUser">
          <img src={imageUrl} alt='Avatar' className = "avatar"/>
          <p>{pseudo}</p>
        </div>}
    </StyledInformations>
  );
}

export default Informations;