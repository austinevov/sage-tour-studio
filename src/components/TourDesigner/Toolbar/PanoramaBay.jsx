import React, { Component } from 'react';
import styled from 'styled-components';
import PanoramaTab from './PanoramaTab';
import { connect } from 'react-redux';

class PanoramaBay extends Component {
  render() {
    return (
      <Container>
        {this.props.panoramaIds.map(id => (
          <PanoramaTab id={id} />
        ))}
      </Container>
    );
  }
}

const Container = styled.div`
  background-color: #4d575a;
  grid-row: 2/3;
  grid-column: 1/3;
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
`;

function mapStateToProps(state) {
  return {
    panoramaIds: state.tourDesign.panoramas.bayIds
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanoramaBay);
