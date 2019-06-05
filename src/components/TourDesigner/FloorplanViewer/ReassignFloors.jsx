import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { UPDATE_FLOOR } from '../../../constants/actionTypes';

class ReassignFloors extends Component {
  stopBubbling = evt => {
    evt.stopPropagation();
  };

  render() {
    const minFloor = '1';
    const maxFloor = `${this.props.floors.length}`;
    return (
      <Container
        onClick={this.stopBubbling}
        onMouseMove={this.stopBubbling}
        onMouseUp={this.stopBubbling}
        onMouseDown={this.stopBubbling}
      >
        <ExitButton onClick={this.props.exit}>&times;</ExitButton>
        <Header>Reassign Floors</Header>
        <FloorList>
          {this.props.floors.map(floor => (
            <FloorContainer key={floor.path}>
              <a href={floor.path} target='_blank'>
                {floor.path.substr(floor.path.lastIndexOf('/') + 1)}
              </a>
              <FloorInput
                type='number'
                min={minFloor}
                max={maxFloor}
                size='1'
                maxlength='3'
                value={floor.floor}
                onChange={evt => {
                  this.props.updateFloor(floor.id, evt.target.value);
                }}
              />
            </FloorContainer>
          ))}
        </FloorList>
      </Container>
    );
  }
}

const ExitButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  border: none;
  outline: none;
  cursor: pointer;

  font-size: 22px;
  background-color: transparent;
`;

const FloorInput = styled.input`
  user-select: auto;
`;

const Dropdown = styled.select`
  &,
  * {
    user-select: auto;
    z-index: 100000;
  }
`;
const DropdownOption = styled.option``;
const FloorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  a {
    font-size: 14px;
    text-overflow: ellipsis;
    max-width: 75%;
    white-space: nowrap;
    overflow: hidden;
    flex-grow: 1;
  }
`;

const FloorList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 75%;
  padding: 20px 20px;

  border: 1px solid rgba(0, 0, 0, 0.5);
`;

const Header = styled.h2`
  font-size: 16px;
  padding: 0;
  text-align: center;
`;

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  min-height: 50%;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    floors: state.tourDesign.floorplans
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateFloor: (id, floor) => {
      dispatch({ type: UPDATE_FLOOR, payload: { id, floor } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReassignFloors);
