import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { basePath } from "../../utils/pagesData";
import { useContext } from "react";
import { Context } from "../../utils/Context";

const StyledButton = styled.button`
${props => props.className === "isWelcome" && `
color : red;
height : 100px;
width : 400px;
background-color : blue;
border-radius : 30px;
display: flex;
justify-content : center;
align-items : center;
margin : 10px;
`}
${props => props.className === "isNav" && `
color : red;
height : 30px;
width : 150px;
background-color : blue;
border-radius : 10px;
display: flex;
justify-content : center;
align-items : center;
margin : 10px;
`}
`

function Button({title, link, className}) {
  const {token, setToken} = useContext(Context);
  const navigate = useNavigate();

  const handleOnClick = async function () {
    if (title === "Log out") {
      try {
        const res = await fetch (`${basePath}/users/logout`, {
          method : "POST",
          headers: { 
            Authorization: `Bearer ${token}`
            }
        });

        if (res.status === 200) {
          console.log("Log out succeeded");
        }
        else console.log("Log out failed")

      } catch {
        console.log("Log out failed")
      }
      setToken("none");
    }
    else {
      navigate(`/${link}`);
    }
  };
  
  
  return (
    <StyledButton className = {className} onClick = {handleOnClick}>
      {title}
    </StyledButton>
  );
}

export default Button;