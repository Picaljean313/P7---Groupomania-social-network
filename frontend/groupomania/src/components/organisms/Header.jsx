import Nav from '../molecules/Nav';
import Informations from '../atoms/Informations';
import styled from 'styled-components';
import {pagesData} from '../../utils/pagesData';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100px;
  width : 100%;
`

function Header() {
  const currentPage = window.location.pathname === "/" ? "welcome" : window.location.pathname.split('/')[1];
  const title = pagesData[currentPage].title;

  return (
    <StyledHeader>
      <Informations />
      <h1>{title}</h1>
      <Nav />
    </StyledHeader>
  );
}

export default Header;