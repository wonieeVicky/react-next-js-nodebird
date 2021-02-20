import { Form, Input, Button } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  useEffect(() => {
    setCommentText("");
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    // 이 action이 재사용이 될 가능성이 있으면 별도의 컴포넌트로 분리하고, 그게 아니라면 직접 아래와 같이 넣어준다.
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button
          style={{ position: "absolute", right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
