import styled from "styled-components";
import {pagesData} from "../../utils/pagesData";
import Button from "../atoms/Button";

const StyledNav = styled.nav`
width : 200px;
padding-top : 20px;
`

function Nav() {
  const currentPage = window.location.pathname === "/" ? "welcome" : window.location.pathname.split('/')[1];
  const nav = pagesData[currentPage].nav;
  
  return (
    <StyledNav>
      {nav.map(e => <Button key={e} title = {e === "logOut" ? "Log out" : pagesData[e].title} link= {(e === "welcome" || e === "logOut") ? "" : e} className="isNav" />)}
    </StyledNav>
  );
}

export default Nav;