import { channel, delay } from 'redux-saga';
import {
  take,
  takeEvery,
  takeLatest,
  all,
  call,
  put
} from 'redux-saga/effects';
import Cookie from 'js-cookie';

import {
  FETCH_AUTHENTICATE,
  RECEIVE_AUTHENTICATE
} from '../constants/actionTypes';
import { push } from 'connected-react-router';
import getSelf from '../services/getSelf';

function* authenticateWorker() {}

export default function* watchAuthenticate() {}
