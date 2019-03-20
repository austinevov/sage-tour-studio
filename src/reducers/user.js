import { RECEIVE_SELF, LOGOUT } from '../constants/actionTypes';

const initialState = {
  email: '',
  firstName: '',
  lastName: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SELF: {
      const { email, firstName, lastName } = action.payload;
      return Object.assign({}, state, {
        email,
        firstName,
        lastName
      });
    }
    case LOGOUT: {
      return Object.assign({}, state, {
        email: '',
        firstName: '',
        lastName: ''
      });
    }
  }

  return state;
};
