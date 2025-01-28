import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { FILE_MAX_SIZE } from "../constants/constants";
import { Error } from "./auth-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin-bottom: 15px;
`;
const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 500;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

const EditButton = styled.button`
  background-color: green;
  color: white;
  border: 0;
  font-weight: 500;
  border: 0;
  font-size: 12px;
  padding: 5px 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
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

const EditCompleteButton = styled.button`
  background-color: #3a3a3a;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 12px;
  padding: 6px 12px;
  text-transform: uppercase;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a4a4a;
  }
`;

const EditFileLabel = styled.label`
  background-color: lightgray;
  color: black;
  border: 0;
  font-weight: 500;
  border: 0;
  font-size: 12px;
  margin-top: 15px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
const EditFile = styled.input`
  display: none;
`;

const ColumnPhoto = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false); //tweet 수정 여부
  const [editValue, setEditValue] = useState(tweet); //수정한 tweet
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("게시물을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id)); //트윗 삭제 (document 삭제)
      if (photo) {
        const photoRef = ref(storage, `tweets/${user?.uid}/${id}`); //트윗을 생성할 때의 경로랑 같음!
        await deleteObject(photoRef); //사진(객체) 삭제
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;

    try {
      if (!user || tweet === "" || tweet.length > 180) return;
      updateDoc(doc(db, "tweets", id), {
        tweet: editValue,
      });
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size < FILE_MAX_SIZE) {
        setFile(files[0]);
        setError(""); //에러 메시지 초기화

        if (user && photo) {
          const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
          const result = await uploadBytes(photoRef, files[0]);
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc(db, "tweets", id), {
            photo: url,
          });
        }
      } else {
        setError("1MB 미만의 이미지만 업로드 할 수 있습니다.");
        setFile(null);
      }
    }
  };

  return (
    //todo: 코드 챌린지- edit 버튼 만들기(사진 삭제&변경도 가능하면 굳굳)
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {isEditing ? (
          <>
            <EditInput
              onChange={(e) => setEditValue(e.target.value)}
              value={editValue}
            />
            <EditCompleteButton onClick={onEdit}>수정 완료</EditCompleteButton>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            <EditButton onClick={() => setIsEditing(true)}>✏️</EditButton>
          </>
        )}

        {/*현재 로그인한 유저와 글 작성자와 같다면 삭제 버튼 */}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>🗑️</DeleteButton>
        ) : null}
      </Column>
      {photo ? (
        <ColumnPhoto>
          <Photo src={photo} />
          <EditFileLabel htmlFor="editFile">사진 수정 📷 </EditFileLabel>
          <EditFile
            type="file"
            onChange={onFileChange}
            id="editFile"
            accept="image/*"
          />
        </ColumnPhoto>
      ) : null}
      {error ? <Error>{error}</Error> : ""}
    </Wrapper>
  );
}
