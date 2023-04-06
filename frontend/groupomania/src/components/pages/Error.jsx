import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

const opacityChange = keyframes`
0% {opacity : 0}
100% {opacity : 1}
`


const StyledBackground = styled.div`
position : relative;
background: url('/images/themes/sea.jpeg');
background-size: cover;
background-position : center;
height: 100%;
width: 100%;
animation-name : ${opacityChange};
animation-duration : 10s;
`

const StyledMessage = styled.p`
position : absolute;
top : 50%;
left : 50%;
width : 800px;
font-size : 20px;
margin-top : -10px;
margin-left : -400px;
text-align : center;
color : #bd1919;
animation: item-disappearance 2000ms both;
`

function Error () {

  return (<React.Fragment>
      <StyledBackground></StyledBackground>
      <StyledMessage>Oups, impossible de charger la page !<br /><br />Profitez de la vue <br />ou bien vérifiez votre url 🤨</StyledMessage>
    </React.Fragment>)
}
export default Error;