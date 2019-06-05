import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import mouseWheel from 'mouse-wheel';

import clamp from '../../../utils/clamp';
import {
  MOUSE_OVER_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN,
  UPDATE_PANORAMA_POSITION,
  BEGIN_PANORAMA_DRAG,
  PREVIEW_PANORAMA,
  ADD_EDGE,
  ERASE_PANORAMA,
  REMOVE_EDGE,
  SET_FLOORPLAN_ROTATION,
  UPDATE_VIEWBOX
} from '../../../constants/actionTypes';
import rotate2 from '../../../utils/rotate2';
import {
  MOVE_TOOL,
  LINK_TOOL,
  ERASER_TOOL
} from '../../../constants/toolTypes';
import FloorChanger from './FloorChanger';
import ReassignFloorButton from './ReassignFloorButton';
import { getFloorplanByFloor } from '../../../selectors/tourDesign';
import ReassignFloors from './ReassignFloors';

const ZOOM_MULTIPLIER = 0.005;
const PAN_SPEED = 1.5;
const ZOOM_SPEED = 0.07;
const WHEEL_CX = 50;
const WHEEL_CY = 50;
const WHEEL_R = 40;

class FloorplanViewer extends Component {
  state = {
    viewboxDimensions: {
      w: 0,
      h: 0
    },
    center: {
      x: 0,
      y: 0
    },
    width: 0,
    height: 0,
    transform: '',
    zoom: 1.0,
    zoomDelta: 0.0,
    isDragging: false,
    mousePosition: [0, 0],
    mouseFloorplanPosition: [0, 0],
    panStart: [0, 0],
    panOffset: [0, 0],
    panDelta: [0, 0],
    isDraggingMarker: false,
    isLinking: false,
    linkStart: [0, 0],
    linkStartId: undefined,
    isLinkSnapped: false,
    linkSnapId: undefined,
    isFraming: false,
    frameId: undefined,
    isReassigningFloor: false
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.transform !== nextState.transform) {
      return true;
    }

    if (this.state.isReassigningFloor !== nextState.isReassigningFloor) {
      return true;
    }

    if (this.props.src !== nextProps.src) {
      return true;
    }

    if (this.props.capturedIds !== nextProps.capturedIds) {
      return true;
    }

    if (this.props.draggedId !== nextProps.draggedId) {
      return true;
    }

    if (this.props.draggedPanorama !== nextProps.draggedPanorama) {
      return true;
    }

    if (this.props.isDraggingPanorama) {
      return true;
    }

    if (this.state.zoom !== nextState.zoom) {
      return true;
    }

    if (this.props.floorplanRotation !== nextProps.floorplanRotation) {
      return true;
    }

    if (
      this.props.viewBoxX !== nextState.width ||
      this.props.viewBoxY !== nextState.height
    ) {
      return true;
    }

    if (this.state.isLinking || this.state.isLinking !== nextState.isLinking) {
      return true;
    }

    if (this.props.panoramas !== nextProps.panoramas) {
      return true;
    }

    return true;
  };

  fetchSettings = floorplanSrc => {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const { naturalWidth, naturalHeight } = image;
        const basis = Math.min(naturalWidth, naturalHeight);
        const size = 614;
        const aspectRatio = basis / size;
        const viewboxDimensions = {
          w: naturalWidth,
          h: naturalHeight
        };

        const center = {
          x: naturalWidth / 2,
          y: naturalHeight / 2
        };

        resolve({ viewboxDimensions, center });
      };
      image.src = floorplanSrc;
    });
  };

  componentDidMount = () => {
    this.fetchSettings(this.props.src).then(({ viewboxDimensions, center }) => {
      this.setState({ viewboxDimensions, center });
    });

    this.resize();
    window.addEventListener('resize', this.resize);
    mouseWheel(this.container, this.handleZoom);
    this.props.updateViewBox(
      this.container.clientWidth,
      this.container.clientHeight
    );
    requestAnimationFrame(this.animate);
  };

  handleMouseUp = evt => {
    this.setState({ isDragging: false });
  };

  handleMouseDown = evt => {
    evt.preventDefault();
    const [x, y] = this.state.mousePosition;
    this.setState({ isDragging: true, panStart: [x, y] });
  };

  startMarkerDrag = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    this.setState({ isDraggingMarker: true });

    window.addEventListener('mouseup', this.stopMarkerDrag);
  };

  stopMarkerDrag = () => {
    this.setState({ isDraggingMarker: false });
    window.removeEventListener('mouseup', this.stopMarkerDrag);
  };

  handleMove = evt => {
    const { clientX, clientY } = evt;
    const rx = clientX;
    const ry = clientY;

    this.transformRelativeToFloorplan([rx, ry]);

    if (this.state.isDragging) {
      const pdx = rx - this.state.panStart[0];
      const pdy = ry - this.state.panStart[1];

      const panDelta = [
        (pdx * PAN_SPEED) / this.state.zoom,
        (pdy * PAN_SPEED) / this.state.zoom
      ];

      this.setState({ panDelta, panStart: [rx, ry] });
    }

    if (this.props.isDraggingPanorama) {
      this.props.updatePanoramaPosition(
        this.transformRelativeToFloorplan([rx, ry])
      );
    }

    if (this.state.isDraggingMarker) {
      const dx = clientX - WHEEL_CX;
      const dy = clientY - WHEEL_CY;
      const angle = Math.atan2(dy, dx);

      this.props.setFloorplanRotation(angle);
    }

    this.setState({
      mousePosition: [rx, ry],
      mouseFloorplanPosition: this.transformRelativeToFloorplan([rx, ry])
    });
  };

  handleZoom = (dx, dy, dz) => {
    const delta = dy * ZOOM_MULTIPLIER;
    const zoomDelta = this.state.zoomDelta - delta * ZOOM_SPEED;
    this.setState({ zoomDelta });
  };

  animate = () => {
    const boundX = this.state.viewboxDimensions.w / 2;
    const boundY = this.state.viewboxDimensions.h / 2;
    const cx = this.props.viewBoxX / 2;
    const cy = this.props.viewBoxY / 2;

    const pox = clamp(this.state.panOffset[0], -boundX, boundX);
    const poy = clamp(this.state.panOffset[1], -boundY, boundY);
    const tx = cx + pox;
    const ty = cy + poy;

    const rotationAngle = this.props.floorplanRotation * (180 / Math.PI);

    const transform = `translate(${tx}, ${ty}) scale(${
      this.state.zoom
    }) translate(${-tx}, ${-ty}) translate(${cx - tx}, ${cy -
      ty}) translate(${cx}, ${cy}) rotate(${rotationAngle}) translate(-${cx}, -${cy})`;

    this.floorplanGroup.setAttribute('transform', transform);

    this.setState({
      zoom: this.state.zoom + this.state.zoomDelta,
      zoomDelta: this.state.zoomDelta * 0.75,
      panOffset: [pox - this.state.panDelta[0], poy - this.state.panDelta[1]],
      panDelta: [0, 0]
    });

    requestAnimationFrame(this.animate);
  };

  transformRelativeToFloorplan = relative => {
    let [rx, ry] = relative;
    const cx = this.props.viewBoxX / 2;
    const cy = this.props.viewBoxY / 2;

    const svgImage = document.getElementById('sage-fp-image');
    let ox = 0;
    let oy = 0;
    if (svgImage) {
      const rect = svgImage.getBoundingClientRect();
      ox = (rect.left + rect.right) / 2;
      oy = (rect.top + rect.bottom) / 2;
    }

    rx = rx / this.state.zoom - ox / this.state.zoom;
    ry = ry / this.state.zoom - oy / this.state.zoom;

    let [x, y] = rotate2([rx, ry], -this.props.floorplanRotation);

    x += cx;
    y += cy;

    return [x, y];
  };

  resize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.setState({ width, height });
  };

  startDrag = (id, evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.props.activeTool === MOVE_TOOL) {
      this.props.beginDrag(id, [evt.clientX, evt.clientY]);
    } else if (this.props.activeTool === LINK_TOOL) {
      this.startLinking(id);
    } else if (this.props.activeTool === ERASER_TOOL) {
      this.erasePanorama(id);
    }
  };

  removeEdge = (start, finish) => {
    if (this.props.activeTool === ERASER_TOOL) {
      this.props.removeEdge(start, finish);
    }
  };
  erasePanorama = id => {
    this.props.panoramas[id].edges.forEach(edge => {
      this.props.removeEdge(id, edge);
    });
    this.props.erasePanorama(id);
  };

  startLinking = startId => {
    this.setState({
      isLinking: true,
      linkStart: this.props.panoramas[startId].position,
      linkStartId: startId
    });

    window.addEventListener('mouseup', this.stopLinking);
  };

  stopLinking = () => {
    window.removeEventListener('mouseup', this.stopLinking);

    if (
      this.state.isLinkSnapped &&
      this.state.linkStartId !== this.state.linkSnapId
    ) {
      this.props.addEdge(this.state.linkStartId, this.state.linkSnapId);
    }

    this.setState({ isLinking: false, isLinkSnapped: false });
  };

  snapLink = id => {
    this.setState({ isLinkSnapped: true, linkSnapId: id });
  };

  unsnapLink = id => {
    if (id === this.state.linkSnapId) {
      this.setState({ isLinkSnapped: false, linkSnapId: undefined });
    }
  };

  render() {
    const vbW = this.props.viewBoxX;
    const vbH = this.props.viewBoxY;

    const markerX = WHEEL_CX + WHEEL_R * Math.cos(this.props.floorplanRotation);
    const markerY = WHEEL_CY + WHEEL_R * Math.sin(this.props.floorplanRotation);

    let edges = [];

    this.props.capturedIds.forEach(id => {
      const start = this.props.panoramas[id];
      start.edges.forEach(edgeId => {
        edges.push([Math.min(id, edgeId), Math.max(id, edgeId)]);
      });
    });

    return (
      <Container
        id='floorplan-viewer'
        key='ev-fpv-container'
        ref={container => {
          this.container = container;
        }}
        onMouseMove={this.handleMove}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
      >
        <SVG
          key='ev-fpv-svg'
          preserveAspectRatio='xMidYMid meet'
          viewBox={`0 0 ${vbW} ${vbH}`}
        >
          <g
            key='ev-fpv-g'
            ref={group => {
              this.floorplanGroup = group;
            }}
          >
            <image
              x='0px'
              y='0px'
              id='sage-fp-image'
              key='ev-fpv-img'
              xlinkHref={this.props.src}
              width={`${vbW}px`}
              height={`${vbH}px`}
            />
            {this.state.isLinking && (
              <line
                stroke='green'
                strokeWidth='2'
                x1={this.state.linkStart[0]}
                y1={this.state.linkStart[1]}
                x2={
                  this.state.isLinkSnapped
                    ? this.props.panoramas[this.state.linkSnapId].position[0]
                    : this.state.mouseFloorplanPosition[0]
                }
                y2={
                  this.state.isLinkSnapped
                    ? this.props.panoramas[this.state.linkSnapId].position[1]
                    : this.state.mouseFloorplanPosition[1]
                }
              />
            )}

            {edges.map(neighbors => {
              const start = neighbors[0];
              const end = neighbors[1];

              return [
                <line
                  stroke='green'
                  strokeWidth='2'
                  x1={this.props.panoramas[start].position[0]}
                  y1={this.props.panoramas[start].position[1]}
                  x2={this.props.panoramas[end].position[0]}
                  y2={this.props.panoramas[end].position[1]}
                />,
                <line
                  stroke='green'
                  strokeWidth='20'
                  onMouseDown={() => this.removeEdge(start, end)}
                  opacity='0'
                  x1={this.props.panoramas[start].position[0]}
                  y1={this.props.panoramas[start].position[1]}
                  x2={this.props.panoramas[end].position[0]}
                  y2={this.props.panoramas[end].position[1]}
                />
              ];
            })}
            {this.props.capturedIds.map(id => {
              const panorama = this.props.panoramas[id];
              const [x, y] = panorama.position;
              const cx = `${x}px`;
              const cy = `${y}px`;
              return (
                <circle
                  onMouseDown={evt => this.startDrag(id, evt)}
                  onMouseOver={() => this.snapLink(id)}
                  onMouseOut={() => this.unsnapLink(id)}
                  onClick={() => this.props.previewPanorama(id)}
                  key={`ev-sprite-${id}`}
                  r='15px'
                  cx={cx}
                  cy={cy}
                  fill='#00ff00'
                />
              );
            })}
          </g>
          <circle
            cx={`${WHEEL_CX}`}
            cy={`${WHEEL_CY}`}
            r={`${WHEEL_R}`}
            stroke='#2d4146'
            stroke-width='3'
            fill='none'
            key='ev-rotation-wheel'
          />
          <RotationMarker
            cx={`${markerX}`}
            cy={`${markerY}`}
            r='10'
            fill='#4d575a'
            key='ev-rotation-marker'
            onMouseDown={this.startMarkerDrag}
          />
        </SVG>
        <FloorChanger />
        <ReassignFloorButton
          openReassignFloor={() => {
            this.setState({ isReassigningFloor: true });
          }}
        />
        {this.state.isReassigningFloor && (
          <ReassignFloors
            exit={() => this.setState({ isReassigningFloor: false })}
          />
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  grid-row: 1/2;
  grid-column: 1/2;
  position: relative;
  max-width: 100%;
  max-height: 100%;

  user-select: none;
  background-color: white;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  * {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  image {
    max-width: 100%;
    max-height: 100%;
  }
`;

const RotationMarker = styled.circle`
  cursor: pointer;
`;

function mapStateToProps(state) {
  const currentFloor = state.tourDesign.currentFloor;
  const panoramas = state.tourDesign.panoramas.byId;
  const capturedIds = state.tourDesign.panoramas.capturedIds.filter(
    id => panoramas[id].floor === currentFloor
  );
  const draggedId = state.tourDesign.panoramas.draggedId;
  const isDraggingPanorama =
    state.tourDesign.isDragging && state.tourDesign.isOverFloorplan;
  const draggedPanorama = isDraggingPanorama ? panoramas[draggedId] : undefined;

  return {
    capturedIds,
    panoramas,
    isDraggingPanorama,
    draggedId,
    draggedPanorama,
    activeTool: state.tourDesign.activeTool,
    floorplanRotation: getFloorplanByFloor(state, currentFloor).theta,
    viewBoxX: state.tourDesign.viewBoxX,
    viewBoxY: state.tourDesign.viewBoxY
  };
}

function mapDispatchToProps(dispatch) {
  return {
    enterFloorplan: () => {
      dispatch({ type: MOUSE_OVER_FLOORPLAN });
    },
    leaveFloorplan: () => {
      dispatch({ type: MOUSE_LEAVE_FLOORPLAN });
    },
    updatePanoramaPosition: position => {
      dispatch({ type: UPDATE_PANORAMA_POSITION, payload: { position } });
    },
    beginDrag: (id, mousePosition) => {
      dispatch({ type: BEGIN_PANORAMA_DRAG, payload: { id, mousePosition } });
    },
    previewPanorama: id => {
      dispatch({ type: PREVIEW_PANORAMA, payload: { id } });
    },
    addEdge: (startId, endId) => {
      dispatch({ type: ADD_EDGE, payload: { startId, endId } });
    },
    erasePanorama: id => {
      dispatch({ type: ERASE_PANORAMA, payload: { id } });
    },
    removeEdge: (startId, endId) => {
      dispatch({ type: REMOVE_EDGE, payload: { startId, endId } });
    },
    setFloorplanRotation: rotation => {
      dispatch({ type: SET_FLOORPLAN_ROTATION, payload: { rotation } });
    },
    updateViewBox: (vbx, vby) => {
      dispatch({ type: UPDATE_VIEWBOX, payload: { vbx, vby } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorplanViewer);
