import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { FILE_MAX_SIZE } from "../constants/constants";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: lightgray;
  cursor: pointer;
  svg {
    height: 60px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;
const NameField = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;
const EditButton = styled.div`
  cursor: pointer;
  & :hover {
    color: gray;
  }
  svg {
    height: 20px;
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #4a4a4a;
  background-color: #2c2c2c;
  color: white;
  font-size: 16px;
  margin: 8px 0;
  transition: border-color 0.2s;
`;
export default function Profile() {
  const user = auth.currentUser; //현재 유저!! 중요

  const [isEditing, setIsEditing] = useState(false); //이름 수정 여부
  const [editName, setEditName] = useState(user?.displayName || "Anonymous"); //수정한 이름
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const onEditName = async () => {
    if (!user?.uid || !isEditing) return;
    try {
      await updateProfile(user, {
        displayName: editName,
      });
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
    }
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    //파일 하나만 필요하기 때문에 이케하는겨!
    if (files && files.length === 1) {
      if (files[0].size < FILE_MAX_SIZE) {
        const file = files[0];

        //avatars라는 폴더에, 파일명은 유저 아이디
        //유저가 이미지를 변경해도 동일한 파일 이름으로 업로드가 되어 덮어 쓰기가 됨!
        const locationRef = ref(storage, `avatars/${user?.uid}`); //ref로 파일 경로 설정
        const result = await uploadBytes(locationRef, file); //uploadBytes로 해당 경로로 file 저장
        const avatarUrl = await getDownloadURL(result.ref); //getDownloadURL로 file의 url 가져오기
        setAvatar(avatarUrl);
        //updateProfile로 가져온 url로 사용자의 photoURL 업데이트
        await updateProfile(user, {
          photoURL: avatarUrl,
        });
      } else {
        alert("1MB 미만의 이미지만 업로드 할 수 있습니다.");
      }
    }
  };
  //사용자의 tweets만 가져오는 query 만들기(여기는 realtime 아님)
  //그냥 데이터를 가져오는 것 이외에 where이나 orderBy를 사용해서 다른 순서로 가져오고 싶거나,
  //필터링해서 가져오고 싶으면 파이어베이스와 firestore에 더욱 자세히 알려줘야함(flexible해서 그럼,, index에 기록해주면 됨)
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      //필터링(조건에 맞는것만 가져올 수 있도록)
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(tweetQuery); //getDocs는 query snpashot을 반환, snapshot에는 documents가 있숨
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    //todo: 코드챌린지/ 버튼 눌러서 닉네임 변경
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <NameField>
        <Name>
          {isEditing ? (
            <EditInput
              onChange={(e) => setEditName(e.target.value)}
              value={editName}
            />
          ) : (
            user?.displayName ?? "Anonymous"
          )}
        </Name>

        <EditButton
          onClick={() => {
            isEditing
              ? (setIsEditing(false), onEditName())
              : setIsEditing(true);
          }}
        >
          {isEditing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          )}
        </EditButton>
      </NameField>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
