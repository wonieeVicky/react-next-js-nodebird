import { useCallback, useRef, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPost, UPLOAD_IMAGES_REQUEST } from "../reducers/post";
import useInput from "../hooks/useInput";

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput("");

  useEffect(() => {
    if (addPostDone) {
      setText(""); // 초기화
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => dispatch(addPost(text)), [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => imageInput.current.click(), [imageInput.current]);

  const onChangeImages = useCallback(
    (e) => {
      const imageFormData = new FormData(); // multipart 형식으로 보낼 수 있다.
      // e.target.files는 유사배열이므로 [].forEach.call 메서드를 사용함
      [].forEach.call(e.target.files, (f) => imageFormData.append("image", f)); // imageupload 라우터 내 upload.array('image')가 같아야 한다.
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    },
    [imageInput.current]
  );

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="오늘은 어떤 맛있는 것을 드셨나요?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v} style={{ width: 200 }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
