﻿import axios from "axios";
import { all, fork } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL = "http://localhost:3065";

// merge sagas
export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
