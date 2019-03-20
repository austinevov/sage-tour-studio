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
  UPLOAD_TOUR,
  UPLOAD_REDIRECT
} from '../constants/actionTypes';
import { getTour } from '../selectors/tour';
import uploadTour from '../services/uploadTour';

function* uploadWorker(action) {
  const tour = yield select(getTour);
  yield call(uploadTour, tour);
  yield put({ type: UPLOAD_REDIRECT });
}

export default function* watchUpload() {
  yield takeEvery(UPLOAD_TOUR, uploadWorker);
}
