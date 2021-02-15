export const initialState = {
  isLoggedIn: false,
  user: null,
  signUpData: {},
  loginData: {},
};

// Action Creator(액션 함수) : 데이터가 동적으로 주입되도록 구현
export const loginAction = (data) => ({ type: "LOG_IN", data });
export const logoutAction = () => ({ type: "LOG_OUT" });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
      };
    case "LOG_OUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
