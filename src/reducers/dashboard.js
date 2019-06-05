import {
  UPLOAD_REDIRECT,
  CHANGE_CONTENT,
  SET_CREATE_TOUR,
  ACTIVATE_CONFIRMATION,
  DEACTIVATE_CONFIRMATION,
  BEGIN_MEDIA_UPDATE,
  END_MEDIA_UPDATE
} from '../constants/actionTypes';
import {
  ACCOUNT_CONTENT
} from '../constants/contentTypes';

const initialState = {
  activeContent: ACCOUNT_CONTENT,
  isCreatingTour: false,
  isShowingConfirmation: false,
  isShowingUpdateMedia: false,
  updateMedia: {
    token: '',
    type: ''
  },
  confirmationPayload: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BEGIN_MEDIA_UPDATE: {
      const {
        token,
        type
      } = action.payload;
      return Object.assign({}, state, {
        isShowingUpdateMedia: true,
        updateMedia: {
          token,
          type
        }
      });
    }
    case END_MEDIA_UPDATE: {
      return Object.assign({}, state, {
        isShowingUpdateMedia: false
      });
    }
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
    case ACTIVATE_CONFIRMATION: {
      return Object.assign({}, state, {
        isShowingConfirmation: true,
        confirmationPayload: {
          ...action.payload
        }
      });
    }
    case DEACTIVATE_CONFIRMATION: {
      return Object.assign({}, state, {
        isShowingConfirmation: false,
        confirmationPayload: undefined
      })
    }
  }

  return state;
};