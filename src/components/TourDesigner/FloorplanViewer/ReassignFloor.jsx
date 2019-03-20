import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Span } from '../../../styles';
import { CHEVRON_UP, CHEVRON_DOWN } from './FloorChanger';
import { SHIFT_FLOOR } from '../../../constants/actionTypes';

class ReassignFloor extends Component {
  render() {
    const grayBottom = this.props.currentFloor <= 1;
    const grayTop = this.props.currentFloor >= this.props.maxFloor;

    return (
      <Container>
        <ReassignSpan>Shift Floor</ReassignSpan>
        <Chevron
          src={CHEVRON_UP}
          gray={grayTop}
          onClick={() => this.props.shiftFloor(1)}
        />
        <Chevron
          src={CHEVRON_DOWN}
          gray={grayBottom}
          onClick={() => this.props.shiftFloor(-1)}
        />
      </Container>
    );
  }
}

const Chevron = styled.img`
  width: 15px;
  height: 15px;

  margin-left: 10px;
  cursor: pointer;

  ${props =>
    props.gray &&
    css`
      opacity: 0.2;
    `}
`;

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
)(ReassignFloor);
