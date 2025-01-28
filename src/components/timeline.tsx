import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;
export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc") //createdAt을 기준으로 desc(내림차순!)
    );
    //쿼리의 snapshot을 받아서, 쿼리에서 반환된 각 문서 내부의 데이터를 출력
    const snapshot = await getDocs(tweetsQuery);
    //map함수를 사용하여 트윗 배열 안에 모든 문서를 저장
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data(); //ITweet을 만족하는 모든 데이터 추출
      //추출한 데이터를 객체로 반환
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweet(tweets); //추출한 트윗들을 상태에 저장
  };

  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
