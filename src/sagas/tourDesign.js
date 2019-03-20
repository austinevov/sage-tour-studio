import { channel, delay } from 'redux-saga';
import {
  take,
  takeEvery,
  takeLatest,
  all,
  call,
  put,
  select
} from 'redux-saga/effects';

import { push } from 'connected-react-router';
import {
  FETCH_TOUR,
  RECEIVE_TOUR,
  BEGIN_PANORAMA_DRAG,
  END_PANORAMA_DRAG,
  ENABLE_DRAG,
  UPDATE_MOUSE,
  SAVE_TOUR
} from '../constants/actionTypes';
import fetchTour from '../services/fetchTour';
import tour from '../reducers/tour';
import { getUpdatedTour } from '../selectors/tourDesign';
import saveTour from '../services/saveTour';

const mouseChannel = channel();

function* fetchTourWorker(action) {
  const token = action.payload.token;
  const tourData = yield call(fetchTour, token);
  if (tourData.error) {
    yield put(push('/'));
    alert('Invalid tour token!');
  } else {
    yield put({ type: RECEIVE_TOUR, payload: { tourData, token } });
  }
}

function onMouseUp() {
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('mousemove', onMouseMove);
  mouseChannel.put({ type: END_PANORAMA_DRAG });
}

function onMouseMove(evt) {
  const { clientX, clientY } = evt;
  mouseChannel.put({ type: UPDATE_MOUSE, payload: { clientX, clientY } });
}

function* dragWorker(action) {
  const { id, mousePosition } = action.payload;

  yield put({
    type: UPDATE_MOUSE,
    payload: { clientX: mousePosition[0], clientY: mousePosition[1] }
  });
  yield put({ type: ENABLE_DRAG, payload: { id } });

  window.addEventListener('mouseup', onMouseUp, false);
  window.addEventListener('mousemove', onMouseMove, false);
}

function* saveTourWorker() {
  const tour = yield select(getUpdatedTour);
  yield call(saveTour, tour);
  alert('saved');
}

export default function* watchFetchTour() {
  yield takeEvery(FETCH_TOUR, fetchTourWorker);
}
export function* watchSaveTour() {
  yield takeEvery(SAVE_TOUR, saveTourWorker);
}

export function* watchDrag() {
  yield takeEvery(BEGIN_PANORAMA_DRAG, dragWorker);
}

export function* watchMouse() {
  while (true) {
    const action = yield take(mouseChannel);
    yield put(action);
  }
}
