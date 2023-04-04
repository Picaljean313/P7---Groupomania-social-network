import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import basePath from '../../utils/basePath';
import { useContext } from "react";
import { Context } from "../../utils/Context";
import colors from "../../utils/colors";

const StyledButton = styled.button`
${props => props.className === "isWelcome" && `
color : ${colors.secondary};
padding : 30px;
width : 300px;
font-size : 20px;
background-color : ${colors.tertiary};
border-radius : 30px;
display: flex;
justify-content : center;
align-items : center;
margin : 10px;
cursor : pointer;
`}
${props => props.className === "isNav" && `
color : ${colors.secondary};
height : 30px;
width : 100px;
background-color : ${colors.tertiary};
border-radius : 10px;
display: flex;
justify-content : center;
align-items : center;
margin : 5px;
cursor : pointer;
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
    else if (title === "Back") {
      navigate(-1);
    }
    else {
      navigate(link);
    }
  };
  
  
  return (
    <StyledButton className = {className} onClick = {handleOnClick}>
      {title}
    </StyledButton>
  );
}

export default Button;