import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import buildSessionReducer from './reducers/buildSession';
import tourReducer from './reducers/tour';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import tourDesignReducer from './reducers/design/tourDesign';
import dashboardReducer from './reducers/dashboard';

export default combineReducers({
  router: connectRouter(history),
  buildSession: buildSessionReducer,
  tour: tourReducer,
  auth: authReducer,
  user: userReducer,
  tourDesign: tourDesignReducer,
  dashboard: dashboardReducer
});
