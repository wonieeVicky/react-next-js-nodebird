import { Button } from "antd";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  const isFollowing = me?.Followings.find((v) => v.nickname === post.User.id);
  const onCLickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: {
          userId: post.User.id,
          postId: post.id,
        },
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: {
          userId: post.User.id,
          postId: post.id,
        },
      });
    }
  }, [isFollowing]);
  return (
    <Button loading={unfollowLoading || followLoading} onClick={onCLickButton}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default FollowButton;
