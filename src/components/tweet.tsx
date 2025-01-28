import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
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
`;

const EditFile = styled.button`
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
`;

const ColumnPhoto = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isEditing, setIsEditing] = useState(false); //수정 여부
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

  return (
    //todo: 코드 챌린지- edit 버튼 만들기(사진 삭제&변경도 가능하면 굳굳)
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {isEditing ? (
          <>
            <input
              onChange={(e) => setEditValue(e.target.value)}
              value={editValue}
            />
            <button onClick={onEdit}>수정 완료</button>
          </>
        ) : (
          <>
            <Payload>{tweet}</Payload>
            <EditButton onClick={() => setIsEditing(true)}>✏️</EditButton>
          </>
        )}

        {/*현재 로그인한 유저와 글 작성자와 같다면 삭제 버튼 */}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete 🗑️</DeleteButton>
        ) : null}
      </Column>
      {photo ? (
        <ColumnPhoto>
          <Photo src={photo} />
          <EditFile>photo edit 📷</EditFile>
        </ColumnPhoto>
      ) : null}
    </Wrapper>
  );
}
