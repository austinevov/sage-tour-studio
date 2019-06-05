import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { VRSageTour } from '../../packages/sage-tour/src';

class VRTour extends Component {
  componentDidMount = () => {
    const token = this.props.match.params.id;
    const opts = {
      initialYawDegrees: 0,
      imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
      forceLD: false,
      disableControls: false
    };

    this.tour = new VRSageTour(this.container, token, () => {}, opts);
  };

  render() {
    return (
      <Container
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

export default VRTour;
