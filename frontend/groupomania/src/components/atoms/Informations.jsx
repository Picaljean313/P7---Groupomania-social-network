import styled from "styled-components";
import { useContext } from "react";
import { Context } from "../../utils/Context";

const StyledInformations = styled.div`
display : flex;
flex-direction: column;

.logo {
  width: 200px;
  height: 50%;
  object-fit : cover;
}

.user {
  display : flex;
  justify-content : center;
  align-items : center;
  width: 200px;
  height: 50%;
}

.user p {
  font-size : 20px;
  margin-left : 10px;
}

.avatar {
  height : 40px;
  width : 40px;
  border-radius : 50%;
  margin-right : 10px;
}
`

function Informations() {
  const {userData} = useContext(Context);
  const imageUrl = userData.imageUrl;
  const pseudo = userData.pseudo;

  return (
    <StyledInformations>
      <img src={'/images/logo/logo.svg'} alt='Groupomania logo' className = "logo"/>
      {userData !== "none" && <div className="user">
          <img src={imageUrl} alt='Avatar' className = "avatar"/>
          <p>{pseudo}</p>
        </div>}
    </StyledInformations>
  );
}

export default Informations;