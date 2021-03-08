import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

// Reducer는 Swtich문이 포함된 함수 : (이전 상태, 액션) => 다음 상태 도출
// combineReducers로 reducer를 합쳐줄 때 각 initialState는 알아서 합쳐진다.
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

/* combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      // HYDRATE 옵션은 SSR을 위해 추가된 요소이다.
      case HYDRATE:
        console.log("HYDRATE:", action);
        return { ...state, ...action.payload };
      // 초기 렌더링 시 리듀서가 실행되면서 state가 Undefined 되므로 반드시 initialState를 리턴해준다.
      default:
        return state;
    }
  },
  user,
  post,
}); */

export default rootReducer;
