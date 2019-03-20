import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import ControlButton from './ControlButton';
import {
  MOVE_TOOL,
  LINK_TOOL,
  ERASER_TOOL,
  FRAME_TOOL
} from '../../../constants/toolTypes';
import { ACTIVATE_TOOL, SAVE_TOUR } from '../../../constants/actionTypes';

class ControlPanel extends Component {
  render() {
    return (
      <Container>
        <img
          src="/sage_logo_white.svg"
          alt="Sage Logo"
          width="55px"
          height="73px"
        />
        <ControlButton
          onClick={() => this.props.activateTool(MOVE_TOOL)}
          selected={this.props.activeTool === MOVE_TOOL}
          src="/pointer.svg"
        />
        <ControlButton
          onClick={() => this.props.activateTool(LINK_TOOL)}
          selected={this.props.activeTool === LINK_TOOL}
          src="/link.svg"
        />
        <ControlButton
          onClick={() => this.props.activateTool(ERASER_TOOL)}
          selected={this.props.activeTool === ERASER_TOOL}
          src="/erase.svg"
        />
        <ControlButton
          onClick={() => this.props.activateTool(FRAME_TOOL)}
          selected={this.props.activeTool === FRAME_TOOL}
          src="/frame.svg"
        />
        <ControlButton src="/save.svg" onClick={this.props.saveTour} />
      </Container>
    );
  }
}

const Container = styled.div`
  > img {
    user-select: none;
    margin-right: 33px;
    margin-left: 22px;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #2d4146;
  box-shadow: 2px 0 6px 0 rgba(0, 0, 0, 0.21);
  position: relative;
  height: 100%;
  width: auto;
  padding-left: 11px;
  padding-right: 22px;
`;

function mapStateToProps(state) {
  return {
    activeTool: state.tourDesign.activeTool
  };
}
function mapDispatchToProps(dispatch) {
  return {
    activateTool: tool => {
      dispatch({ type: ACTIVATE_TOOL, payload: { tool } });
    },
    saveTour: () => {
      dispatch({ type: SAVE_TOUR });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);
