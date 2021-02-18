export const initialState = {
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signUpData: {},
  loginData: {},
};

// 모든 기록들이 api로 서버와 통신하는 구조이므로 실제 action은 아래와 같이 세가지 타입으로 만들어진다. - 단 success와 failure는 saga에서 처리한다.
export const loginRequestAction = (data) => ({ type: "LOG_IN_REQUEST", data });
export const logoutRequestAction = () => ({ type: "LOG_OUT_REQUEST" });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "vicky" },
      };
    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
