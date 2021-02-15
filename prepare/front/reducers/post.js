export const initialState = {
  // id, content는 소문자이고, User, Images, Comments는 대문자인 이유?
  // DB 시퀄라이즈에서는 어떤 정보가 다른 정보와 관계가 있어서 합쳐져서 나올 경우 앞글자가 대문자로 반환,
  // 즉, id, content는 데이터가 합쳐지지 않는 게시글 자체의 속성이므로 소문자
  // User, Images, Comments는 다른 정보와 합쳐지므로 대문자

  // 더미데이터를 받을 때에는 백엔드 개발자와 response로 내려줄 데이터에 대해 미리 협의하는 것이 좋다.
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "vicky",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_9c7715d77c3a7667.jpg",
        },
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_70707728dc9e7eab.jpg",
        },
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_6341580e2dae2d31.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "wonny",
          },
          content: "와 맛있겠다... 먹고싶어여!",
        },
        {
          User: {
            nickname: "joy",
          },
          content: "요리사가 만든 것 같아요! 레시피는 어디서 보셨나요?",
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

// action type을 상수값으로 정의, 중간에 오타가 나는 일이 없고, 값 변경 시 효율적이다.
const ADD_POST = "ADD_POST";

export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: "더미데이터입니다.",
  User: {
    id: 1,
    nickname: "비키",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에 추가해야 게시글이 위에 올라간다.
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
