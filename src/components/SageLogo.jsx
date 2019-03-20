import React from 'react';
import styled from 'styled-components';

import * as sc from '../styles';

const SageLogo = props => (
  <Wrapper {...props}>
    <img
      src="/sage_logo_white.svg"
      alt="Sage Logo"
      width="80px"
      height="106px"
    />
  </Wrapper>
);

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  padding: 23px 32px;
  cursor: pointer;
`;
const Span = styled(sc.Span)`
  font-family: 'Poiret One', cursive;
`;

export default SageLogo;
