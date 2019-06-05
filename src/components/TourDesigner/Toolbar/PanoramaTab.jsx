import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import {
  RENAME_PANORAMA,
  UPDATE_PANORAMA_LABEL,
  BEGIN_PANORAMA_DRAG,
  END_PANORAMA_DRAG,
  PREVIEW_PANORAMA
} from '../../../constants/actionTypes';

class PanoramaTab extends Component {
  state = {
    isDragging: false
  };

  rename = evt => {
    console.log(evt.target.value);
    this.props.rename(this.props.id, evt.target.value);
  };

  startDrag = evt => {
    this.props.previewPanorama(this.props.id);
    const rect = this.container.getBoundingClientRect();
    const x = (rect.left + rect.right) / 2;
    const y = (rect.top + rect.bottom) / 2;
    this.props.beginDrag(this.props.id, [x, y]);
  };

  render() {
    let [x, y] = this.props.mousePosition;
    x -= 61 / 2;
    y -= 61 / 2;
    const top = `${this.props.isDragging ? y : 0}px`;
    const left = `${this.props.isDragging ? x : 0}px`;
    const visibility =
      this.props.isDragging && this.props.isOverFloorplan
        ? 'hidden'
        : 'visible';
    return (
      <Container
        style={{ top, left, visibility }}
        key={`pano-${this.props.id}`}
        onMouseDown={this.startDrag}
        dragging={this.props.isDragging}
        ref={container => {
          this.container = container;
        }}
      >
        <ThumbnailContainer>
          <Thumbnail
            crossOrigin='anonymous'
            src={`https://s3.amazonaws.com/assets.sagetourstudio/${
              this.props.token
            }/0-0-${this.props.panorama.id}-px.jpg`}
            onClick={evt => evt.preventDefault()}
          />
        </ThumbnailContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  cursor: pointer;
  height: 61px;
  width: fit-content;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0px 16px;
  padding: 0px 0px;
  transition: all 5ms ease-in-out;
  ${props =>
    props.dragging &&
    css`
      pointer-events: none;
      position: fixed;
    `};
  &,
  * {
    box-sizing: border-box;
    z-index: 100000;
  }
`;

const ThumbnailContainer = styled.div`
  height: 100%;
  min-width: 61px;
  max-width: 61px;
  border: none;
  outline: none;
`;

const Thumbnail = styled.img`
  width: 100%;
  user-select: none;

  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const LabelContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input {
    border: 1px dashed #4d575a;
    text-transform: uppercase;
    font-family: 'Spectral', serif;

    color: #4d575a;
    text-align: center;
    width: 80%;
  }
`;

function mapStateToProps(state, ownProps) {
  return {
    panorama: state.tourDesign.panoramas.byId[ownProps.id],
    isDragging:
      state.tourDesign.isDragging &&
      state.tourDesign.panoramas.draggedId === ownProps.id,
    mousePosition: state.tourDesign.mousePosition,
    isOverFloorplan: state.tourDesign.isOverFloorplan,
    token: state.tourDesign.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rename: (id, name) => {
      dispatch({ type: UPDATE_PANORAMA_LABEL, payload: { id, name } });
    },
    beginDrag: (id, mousePosition) => {
      dispatch({ type: BEGIN_PANORAMA_DRAG, payload: { id, mousePosition } });
    },
    previewPanorama: id => {
      dispatch({ type: PREVIEW_PANORAMA, payload: { id } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanoramaTab);
