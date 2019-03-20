import {
  UPLOAD_REDIRECT,
  CHANGE_CONTENT,
  SET_CREATE_TOUR
} from '../constants/actionTypes';
import { ACCOUNT_CONTENT } from '../constants/contentTypes';

const initialState = {
  activeContent: ACCOUNT_CONTENT,
  isCreatingTour: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_REDIRECT: {
      return Object.assign({}, state, {
        activeContent: ACCOUNT_CONTENT,
        isCreatingTour: false
      });
    }
    case CHANGE_CONTENT: {
      return Object.assign({}, state, {
        activeContent: action.payload.content
      });
    }
    case SET_CREATE_TOUR: {
      return Object.assign({}, state, {
        isCreatingTour: action.payload.flag
      });
    }
  }

  return state;
};
