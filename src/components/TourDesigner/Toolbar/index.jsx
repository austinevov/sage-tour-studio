import React, { Component } from 'react';
import styled from 'styled-components';
import ControlPanel from './ControlPanel';
import PanoramaBay from './PanoramaBay';

export default class Toolbar extends Component {
  render() {
    return (
      <Container>
        <ControlPanel />
        <PanoramaBay />
      </Container>
    );
  }
}

const Container = styled.div`
  grid-row: 2/3;
  grid-column: 1/3;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
