import uniqid from 'uniqid';

import {
  UPDATE_TOUR_NAME,
  UPDATE_TOUR_COVER,
  UPDATE_TOUR_ORGANIZATION,
  UPDATE_TOUR_CAPTION,
  UPLOAD_FLOORPLAN,
  RENAME_FLOORPLAN,
  DELETE_FLOORPLAN,
  UPLOAD_PANORAMA,
  RENAME_PANORAMA,
  DELETE_PANORAMA,
  UPDATE_ASSET_LOAD,
  UPDATE_TOUR_BUILDING_NAME,
  UPDATE_TOUR_DESCRIPTION,
  UPLOAD_TOUR,
  UPLOAD_REDIRECT,
  LOGOUT,
  UPDATE_VIEWBOX
} from '../constants/actionTypes';
import { removeFileFormat } from '../utils/removeFileFormat';

const initialState = {
  name: '',
  buildingName: '',
  description: '',
  isUploading: false,
  floorplans: {
    byId: {},
    allIds: []
  },
  panoramas: {
    byId: {},
    allIds: []
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_REDIRECT: {
      return Object.assign({}, initialState);
    }
    case LOGOUT: {
      return Object.assign({}, initialState);
    }
    case UPDATE_TOUR_NAME: {
      return Object.assign({}, state, { name: action.payload.name });
    }
    case UPDATE_TOUR_BUILDING_NAME: {
      return Object.assign({}, state, { buildingName: action.payload.name });
    }
    case UPDATE_TOUR_DESCRIPTION: {
      return Object.assign({}, state, {
        description: action.payload.description
      });
    }
    case UPLOAD_TOUR: {
      return Object.assign({}, state, { isUploading: true });
    }
    case UPLOAD_FLOORPLAN: {
      const id = uniqid();
      return Object.assign({}, state, {
        floorplans: {
          byId: {
            ...state.floorplans.byId,
            [id]: {
              file: action.payload.file,
              img: action.payload.img,
              name: removeFileFormat(action.payload.file.name),
              id,
              isLoading: false,
              loadPercent: 0.0
            }
          },
          allIds: state.floorplans.allIds.concat([id])
        }
      });
    }
    case RENAME_FLOORPLAN: {
      const byId = state.floorplans.byId;
      byId[action.payload.id] = {
        ...byId[action.payload.id],
        name: action.payload.name
      };
      return Object.assign({}, state, {
        floorplans: {
          ...state.floorplans,
          byId
        }
      });
    }
    case DELETE_FLOORPLAN: {
      const byId = state.floorplans.byId;
      delete byId[action.payload.id];
      const allIds = state.floorplans.allIds.filter(
        id => id !== action.payload.id
      );

      return Object.assign({}, state, { floorplans: { byId, allIds } });
    }

    case UPLOAD_PANORAMA: {
      const id = uniqid();
      return Object.assign({}, state, {
        panoramas: {
          byId: {
            ...state.panoramas.byId,
            [id]: {
              file: action.payload.file,
              img: action.payload.img,
              name: removeFileFormat(action.payload.file.name),
              id,
              isLoading: false,
              loadPercent: 0.0
            }
          },
          allIds: state.panoramas.allIds.concat([id])
        }
      });
    }
    case RENAME_PANORAMA: {
      const byId = state.panoramas.byId;
      byId[action.payload.id] = {
        ...byId[action.payload.id],
        name: action.payload.name
      };
      return Object.assign({}, state, {
        panoramas: {
          ...state.panoramas,
          byId
        }
      });
    }
    case DELETE_PANORAMA: {
      const byId = state.panoramas.byId;
      delete byId[action.payload.id];
      const allIds = state.panoramas.allIds.filter(
        id => id !== action.payload.id
      );

      return Object.assign({}, state, { panoramas: { byId, allIds } });
    }
    case UPDATE_ASSET_LOAD: {
      const id = action.payload.id;
      if (state.panoramas.byId[id]) {
        const byId = state.panoramas.byId;
        byId[id].isLoading = true;
        byId[id].loadPercent = action.payload.percent;

        return Object.assign({}, state, {
          panoramas: { ...state.panoramas, byId }
        });
      }

      const byId = state.floorplans.byId;
      byId[id].isLoading = true;
      byId[id].loadPercent = action.payload.percent;

      return Object.assign({}, state, {
        floorplans: { ...state.floorplans, byId }
      });
    }
  }

  return state;
};
