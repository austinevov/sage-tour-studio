import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Span } from '../../../styles';
import { CHEVRON_UP, CHEVRON_DOWN } from './FloorChanger';
import { SHIFT_FLOOR } from '../../../constants/actionTypes';

class ReassignFloorButton extends Component {
  render() {
    return (
      <Container onClick={this.props.openReassignFloor}>
        <ReassignSpan>Reassign Floors</ReassignSpan>
      </Container>
    );
  }
}

const ReassignSpan = styled(Span)`
  text-transform: uppercase;
  font-size: 14px;
  color: white;
  text-align: center;
  font-weight: bold;
`;

const Container = styled.div`
  padding: 5px 10px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  border-radius: 12px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;

  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #2d4146;
`;

function mapStateToProps(state) {
  return {
    currentFloor: state.tourDesign.currentFloor,
    maxFloor: state.tourDesign.maxFloor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    shiftFloor: delta => {
      dispatch({ type: SHIFT_FLOOR, payload: { delta } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReassignFloorButton);
