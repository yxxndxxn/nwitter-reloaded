import styled from "styled-components";
import { auth, storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { FILE_MAX_SIZE } from "../constants/constants";

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

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
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

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {Boolean(avatar) ? (
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
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}
