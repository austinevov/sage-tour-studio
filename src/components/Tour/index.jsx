import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import SageTour from '../../packages/sage-tour/src';
class Tour extends Component {
  componentDidMount = () => {
    const createTour = (container, token, forceLD = false) => {
      const opts = {
        initialYawDegrees: 0,
        imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
        forceLD,
        disableControls: false
      };

      this.tour = new SageTour(container, token, () => {}, opts);
      this.tour.on('context_lost', () => {
        this.tour.destroyDOM();
        createTour(container, token, true);
      });
    };

    const token = this.props.match.params.id;
    createTour(this.container, token);
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

export default Tour;
