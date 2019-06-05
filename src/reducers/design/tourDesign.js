import _ from 'lodash';

import {
  RECEIVE_TOUR,
  UPDATE_PANORAMA_LABEL,
  BEGIN_PANORAMA_DRAG,
  END_PANORAMA_DRAG,
  ENABLE_DRAG,
  UPDATE_MOUSE,
  MOUSE_OVER_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN,
  UPDATE_PANORAMA_POSITION,
  RECEIVE_PREVIEW_CONTAINER,
  PREVIEW_PANORAMA,
  ACTIVATE_TOOL,
  ADD_EDGE,
  ERASE_PANORAMA,
  REMOVE_EDGE,
  ADD_FLOOR,
  SET_FLOORPLAN_ROTATION,
  SHIFT_FLOOR,
  UPDATE_VIEWBOX,
  RESET_TOUR_PREVIEW,
  UPDATE_FLOOR
} from '../../constants/actionTypes';
import intersects from '../../utils/intersects';
import buildTour from '../../utils/buildTour';
import {
  MOVE_TOOL
} from '../../constants/toolTypes';
import {
  getFloorplanByFloor
} from '../../selectors/tourDesign';

const initialState = {
  currentFloor: 1,
  maxFloor: 1,
  isTourLoaded: false,
  token: undefined,
  floorplans: [],
  panoramas: {
    byId: {},
    allIds: [],
    draggedId: undefined,
    bayIds: [],
    capturedIds: []
  },
  isDragging: false,
  mousePosition: [0, 0],
  isOverFloorplan: false,
  isShowingPreview: false,
  previewPanoramaId: undefined,
  tourPreviewContainer: undefined,
  tour: undefined,
  activeTool: MOVE_TOOL,
  viewBoxX: 0,
  viewBoxY: 0,
  isViewBoxSet: false
};

function applyMouseUpdate(state, mousePosition) {
  const [x, y] = mousePosition;

  const isOverFloorplan = intersects('floorplan-viewer', mousePosition);
  let capturedIds = state.panoramas.capturedIds;
  let bayIds = state.panoramas.bayIds;
  const draggedId = state.panoramas.draggedId;
  if (isOverFloorplan && !state.isOverFloorplan) {
    if (state.isDragging) {
      capturedIds = [].concat(capturedIds).concat([draggedId]);
      bayIds = bayIds.filter(id => id !== draggedId);
      state.panoramas.byId[draggedId].isBayed = false;
    }
  } else if (!isOverFloorplan && state.isOverFloorplan) {
    if (state.isDragging) {
      capturedIds = capturedIds.filter(id => id !== draggedId);
      bayIds = [].concat(bayIds).concat([draggedId]);
      state.panoramas.byId[draggedId].isBayed = true;
    }
  }

  capturedIds = _.uniq(capturedIds);
  bayIds = _.uniq(bayIds);

  return Object.assign({}, state, {
    mousePosition,
    isOverFloorplan,
    panoramas: {
      ...state.panoramas,
      capturedIds,
      bayIds
    }
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VIEWBOX: {
      if (state.isViewBoxSet) {
        return state;
      }
      return Object.assign({}, state, {
        viewBoxX: action.payload.vbx,
        viewBoxY: action.payload.vby
      });
    }
    case SHIFT_FLOOR: {
      const originalFloor = state.currentFloor;
      const targetFloor = state.currentFloor + action.payload.delta;
      if (targetFloor < 1 || targetFloor > state.maxFloor) {
        return state;
      }

      const floorplans = state.floorplans.map(floorplan => {
        const newFloorplan = {
          ...floorplan
        };

        if (floorplan.floor === originalFloor) {
          newFloorplan.floor = targetFloor;
        } else if (floorplan.floor === targetFloor) {
          newFloorplan.floor = originalFloor;
        }

        return newFloorplan;
      });

      return Object.assign({}, state, {
        floorplans
      });
    }
    case SET_FLOORPLAN_ROTATION: {
      const floorplans = state.floorplans.map(floorplan => {
        const newFloorplan = {
          ...floorplan
        };
        if (floorplan.floor === state.currentFloor) {
          newFloorplan.theta = action.payload.rotation;
        }
        return newFloorplan;
      });

      if (state.tour) {
        state.tour.setGlobalThetaOffset(action.payload.rotation);
      }
      return Object.assign({}, state, {
        floorplans
      });
    }
    case ADD_FLOOR: {
      return Object.assign({}, state, {
        currentFloor: _.clamp(
          state.currentFloor + action.payload.delta,
          1,
          state.maxFloor
        )
      });
    }
    case UPDATE_PANORAMA_POSITION: {
      const oldPanorama = state.panoramas.byId[state.panoramas.draggedId];
      const position = {
        x: action.payload.position[1],
        y: oldPanorama.floor,
        z: -action.payload.position[0]
      };

      const panorama = {
        ...oldPanorama,
        position: action.payload.position,
        floor: state.currentFloor
      };
      state.panoramas.byId[state.panoramas.draggedId] = panorama;

      state.tour.updatePanoramaPosition(panorama.id, position);

      return state;
    }
    case RECEIVE_TOUR: {
      const {
        floorplans,
        panoramas
      } = action.payload.tourData;
      const allIds = panoramas.map(panorama => panorama.id);
      const byId = {};
      panoramas.forEach(panorama => {
        byId[panorama.id] = panorama;
      });

      const capturedIds = allIds.filter(id => !byId[id].isBayed);
      const bayIds = allIds.filter(id => byId[id].isBayed);

      let tour = state.tour;
      if (state.tourPreviewContainer && !state.tour) {
        tour = buildTour(
          state.tourPreviewContainer,
          allIds.map(id => byId[id]),
          action.payload.token
        );
      }

      let {
        viewBoxX,
        viewBoxY
      } = action.payload.tourData;
      let isViewBoxSet = false;
      if (viewBoxX === 0 || viewBoxY === 0) {
        viewBoxX = state.viewBoxX;
        viewBoxY = state.viewBoxY;
      } else {
        isViewBoxSet = true;
      }

      return Object.assign({}, state, {
        floorplans,
        panoramas: {
          byId,
          allIds,
          capturedIds,
          bayIds
        },
        isTourLoaded: true,
        token: action.payload.token,
        tour,
        maxFloor: floorplans.length,
        viewBoxX,
        viewBoxY,
        isViewBoxSet
      });
    }
    case UPDATE_PANORAMA_LABEL: {
      const {
        id,
        name
      } = action.payload;
      const byId = {
        ...state.panoramas.byId,
        [id]: {
          ...state.panoramas.byId[id],
          label: name
        }
      };
      return Object.assign({}, state, {
        panoramas: {
          ...state.panoramas,
          byId
        }
      });
    }
    case ENABLE_DRAG: {
      return Object.assign({},
        state, {
          isDragging: true
        }, {
          panoramas: {
            ...state.panoramas,
            draggedId: action.payload.id
          }
        }
      );
    }
    case END_PANORAMA_DRAG: {
      return Object.assign({},
        state, {
          isDragging: false
        }, {
          panoramas: {
            ...state.panoramas,
            draggedId: undefined
          }
        }
      );
    }
    case UPDATE_MOUSE: {
      const {
        clientX,
        clientY
      } = action.payload;
      return applyMouseUpdate(state, [clientX, clientY]);
    }
    case PREVIEW_PANORAMA: {
      if (!state.isTourLoaded) {
        return state;
      }
      const panorama = state.panoramas.byId[action.payload.id];
      const floor = panorama.floor;
      const theta = state.floorplans.filter((f) => f.floor === floor)[0].theta;
      state.tour.setGlobalThetaOffset(theta);
      state.tour.changePanorama(action.payload.id);

      return Object.assign({}, state, {
        isShowingPreview: true,
        previewPanoramaId: action.payload.id
      });
    }
    case RESET_TOUR_PREVIEW: {
      if (state.tour) {
        state.tour.destroyDOM();
      }

      return Object.assign({}, state, {
        tour: undefined,
        tourPreviewContainer: undefined
      });
    }
    case RECEIVE_PREVIEW_CONTAINER: {
      if (state.isTourLoaded) {
        const tour = buildTour(
          action.payload.container,
          state.panoramas.allIds.map(id => state.panoramas.byId[id]),
          state.token
        );
        return Object.assign({}, state, {
          tourPreviewContainer: action.payload.container,
          tour
        });
      } else {
        return Object.assign({}, state, {
          tourPreviewContainer: action.payload.container
        });
      }
    }
    case UPDATE_FLOOR: {
      let {
        id,
        floor
      } = action.payload;

      if (floor.length === 0) {
        floor = '1';
      }

      if (Number(floor) < 1) {
        floor = '1';
      } else if (Number(floor) > state.floorplans.length) {
        floor = `${state.floorplans.length}`;
      }

      const oldFloor = state.floorplans.filter((f) => {
        return f.id === id
      })[0].floor;

      const floorplans = state.floorplans.map((f) => {
        const newFloor = Object.assign({}, f);
        if (Number(f.floor) === Number(oldFloor)) {
          newFloor.floor = Number(floor);
        }
        if (Number(f.floor) === Number(floor)) {
          newFloor.floor = Number(oldFloor);
        }

        return newFloor;
      });

      return Object.assign({}, state, {
        floorplans
      });
    }
    case ACTIVATE_TOOL: {
      return Object.assign({}, state, {
        activeTool: action.payload.tool
      });
    }
    case ADD_EDGE: {
      const startPanorama = {
        ...state.panoramas.byId[action.payload.startId]
      };
      const endPanorama = {
        ...state.panoramas.byId[action.payload.endId]
      };

      startPanorama.edges.push(endPanorama.id);
      endPanorama.edges.push(startPanorama.id);
      startPanorama.edges = _.uniq(startPanorama.edges);
      endPanorama.edges = _.uniq(endPanorama.edges);

      const byId = {
        ...state.panoramas.byId,
        [action.payload.startId]: {
          ...startPanorama
        },
        [action.payload.endId]: {
          ...endPanorama
        }
      };

      state.tour.addPanoramaEdge(action.payload.startId, action.payload.endId);

      return Object.assign({}, state, {
        panoramas: {
          ...state.panoramas,
          byId
        }
      });
    }
    case ERASE_PANORAMA: {
      const id = action.payload.id;
      const capturedIds = state.panoramas.capturedIds.filter(cid => cid !== id);
      const bayIds = [].concat(state.panoramas.bayIds).concat([id]);
      state.panoramas.byId[id].isBayed = true;

      return Object.assign({}, state, {
        panoramas: {
          ...state.panoramas,
          capturedIds,
          bayIds
        }
      });
    }
    case REMOVE_EDGE: {
      const {
        startId,
        endId
      } = action.payload;
      const startPanorama = {
        ...state.panoramas.byId[startId]
      };
      const endPanorama = {
        ...state.panoramas.byId[endId]
      };

      startPanorama.edges = startPanorama.edges.filter(id => id !== endId);
      endPanorama.edges = endPanorama.edges.filter(id => id !== startId);

      const byId = {
        ...state.panoramas.byId,
        [startId]: {
          ...startPanorama
        },
        [endId]: {
          ...endPanorama
        }
      };

      state.tour.removePanoramaEdge(startId, endId);

      return Object.assign({}, state, {
        panoramas: {
          ...state.panoramas,
          byId
        }
      });
    }
  }

  return state;
};