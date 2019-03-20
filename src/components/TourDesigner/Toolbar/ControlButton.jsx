import React from 'react';
import styled, { css } from 'styled-components';

const ControlButton = props => (
  <Container selected={props.selected} onClick={props.onClick}>
    <img src={props.src} />
  </Container>
);

const Container = styled.div`
  user-select: none;
  height: 59px;
  width: 59px;
  border: 2px solid #ffffff;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 11px;
  img {
    width: 100%;
  }

  ${props =>
    props.selected &&
    css`
      border: 2px inset #ffffff;
      background-color: #162023;
    `}
`;

export default ControlButton;
