import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import SageTour from '../../../packages/sage-tour';

class Tour extends Component {
  componentDidMount = () => {
    const token = this.props.match.params.id;
    const opts = {
      imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
      disableControls: false
    };
    this.tour = new SageTour(this.container, token, () => {}, opts);
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
`;

export default Tour;
