import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

// Action Creator(액션 함수) : 데이터가 동적으로 주입되도록 구현
export const loginAction = (data) => ({ type: "LOG_IN", data });
export const logoutAction = () => ({ type: "LOG_OUT" });

// Reducer는 Swtich문이 포함된 함수 : (이전 상태, 액션) => 다음 상태 도출
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE:", action);
      return { ...state, ...action.payload };
    case "LOG_IN":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
