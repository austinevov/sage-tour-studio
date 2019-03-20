import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';
import watchAuthentication from './sagas/auth';
import watchFetchTour, {
  watchDrag,
  watchMouse,
  watchSaveTour
} from './sagas/tourDesign';
import watchUpload from './sagas/tour';

const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();
export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware, createLogger())
  )
);
sagaMiddleware.run(watchSaveTour);
sagaMiddleware.run(watchAuthentication);
sagaMiddleware.run(watchFetchTour);
sagaMiddleware.run(watchDrag);
sagaMiddleware.run(watchMouse);
sagaMiddleware.run(watchUpload);
