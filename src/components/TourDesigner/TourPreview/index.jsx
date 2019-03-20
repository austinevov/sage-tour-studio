import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { RECEIVE_PREVIEW_CONTAINER } from '../../../constants/actionTypes';

class TourPreview extends Component {
  componentDidMount = () => {
    this.props.receiveContainer(this.container);
  };
  render() {
    const hideCanvas = !this.props.isShowingPreview;

    return (
      <Container>
        <CanvasContainer
          hideCanvas={hideCanvas}
          ref={container => {
            this.container = container;
          }}
        />
        <p>
          Drag and drop the room tiles below onto the corresponding room in the
          floorplan.
        </p>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  grid-row: 1/2;
  grid-column: 2/3;

  background-color: rgba(77, 87, 90, 0.18);

  p {
    position: absolute;
    top: 50%;
    width: 75%;
    left: 12.5%;
    user-select: none;
    margin: 0px 20px;
    color: #4d575a;
    font-family: Spectral;
    font-size: 32px;
    line-height: 49px;
    text-align: center;
  }
`;
const CanvasContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  ${props =>
    props.hideCanvas &&
    css`
      opacity: 0;
    `}

  &,* {
    z-index: 10;
  }
`;

const Canvas = styled.canvas``;

function mapStateToProps(state) {
  return {
    isShowingPreview: state.tourDesign.isShowingPreview
  };
}

function mapDispatchToProps(dispatch) {
  return {
    receiveContainer: container => {
      dispatch({ type: RECEIVE_PREVIEW_CONTAINER, payload: { container } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourPreview);
