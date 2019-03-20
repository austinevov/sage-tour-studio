import Cookie from 'js-cookie';

import { AUTHENTICATE, LOGOUT } from '../constants/actionTypes';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  isResolved: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      return Object.assign({}, state, {
        isAuthenticated: Cookie.get('connect.sid') != null,
        isResolved: true
      });
    }
    case LOGOUT: {
      axios.get('/logout', { withCredentials: true });
      Cookie.remove('connect.sid');
      return Object.assign({}, state, { isAuthenticated: false });
    }
  }

  return state;
};
