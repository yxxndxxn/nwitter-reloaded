import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Error } from "./auth-components";
import { FILE_MAX_SIZE } from "../constants/constants";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &::focus {
    outline: none;
    border-color: gray;
  }
`;

//파일 첨부 버튼
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: gray;
  text-align: center;
  border-radius: 20px;
  border: 1px solid gray;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none; //input을 안 보이게 하고 label로 동작할 수 있또록!
`;
const SubmitBtn = styled.input`
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //todo: 코드 챌린지, 1MB 미만의 파일만 업로드할 수 있또록! 수정!!
    /*파일이 file인 input이 변경될 때 마다 파일의 배열을 받게 됨
    왜냐하면 어떤 input은 복수의 파일을 업로드 하기 때문! */

    const { files } = e.target;
    // 파일이 오직 한 개인지 확인하는 코드
    if (files && files.length === 1) {
      if (files[0].size < FILE_MAX_SIZE) {
        setFile(files[0]);
        setError(""); //에러 메시지 초기화
      } else {
        setError("1MB 미만의 이미지만 업로드 할 수 있습니다.");
        setFile(null);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser; //현재 사용자 요청
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(), //트윗이 생성된 시간 기록
        username: user.displayName || "Anonymous", //displayname 존재하지 않으면 익명으로 설정
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          // ref == firebasestore와 연결된 변수, url
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}` //"tweets"파일 -> 이 경로에 저장
        );
        const result = await uploadBytes(locationRef, file); //uploadBytes == 참조 url, 들어갈 file
        const url = await getDownloadURL(result.ref); //getDownloadURL == file의 ref
        //코드로 만든 문서에 추가할 데이터를 넣어 업데이트 해줌
        updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        value={tweet}
        onChange={onChange}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        //input type이 file일 때 accept속성은 허용하는 파일 유형을 나타내는 속성
        accept="image/*" //파일 유형 지정! (audio/* => 모든 오디오 파일, video/* => 모든 비디오 파일)
      />
      {error ? <Error>{error}</Error> : ""}
      <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post"} />
    </Form>
  );
}
