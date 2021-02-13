import AppLayout from "../components/AppLayout";
import Head from "next/head";

import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followerList = [{ nickname: "비키" }, { nickname: "워니" }, { nickname: "썬" }];
  const followingList = [{ nickname: "비키" }, { nickname: "워니" }, { nickname: "썬" }];

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
