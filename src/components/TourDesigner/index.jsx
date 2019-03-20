import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';

import FloorplanViewer from './FloorplanViewer';
import TourPreview from './TourPreview';
import Toolbar from './Toolbar';
import { FETCH_TOUR } from '../../constants/actionTypes';
import { getFloorplanByFloor } from '../../selectors/tourDesign';

class TourDesigner extends Component {
  componentDidMount() {
    const token = this.props.match.params.id;
    this.props.fetchTour(token);
  }

  render() {
    return (
      <Flex>
        {this.props.isTourLoaded ? (
          <>
            <Container key="td-container">
              <FloorplanViewer key="td-fpv" src={this.props.floorplanSrc} />
              <TourPreview key="td-preview" />
              <Toolbar key="td-toolbar" />
            </Container>
          </>
        ) : (
          <>
            <LoadingSpan>Loading...</LoadingSpan>
            <Loader
              type="ThreeDots"
              color="black"
              width="100px"
              height="100px"
            />
          </>
        )}
      </Flex>
    );
  }
}

const LoadingSpan = styled.span`
  font-family: 'Spectral';
  font-size: 24px;
  color: #4d575a;
  font-weight: 500;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  display: grid;
  overflow: hidden;
  grid-template-columns: 50% 50%;
  grid-template-rows: minmax(0, 1fr) 110px;
`;

function mapStateToProps(state) {
  const isTourLoaded = state.tourDesign.isTourLoaded;
  let floorplanSrc = '';
  if (isTourLoaded) {
    const floor = state.tourDesign.currentFloor;
    floorplanSrc = getFloorplanByFloor(state, floor).path;
  }

  return {
    isTourLoaded,
    floorplanSrc
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTour: token => {
      dispatch({ type: FETCH_TOUR, payload: { token } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourDesigner);
