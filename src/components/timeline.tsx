import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

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

  /*
  timeline 컴포넌트가 마운트 될 때 구독,
  더이상 timeline 컴포넌트가 사용되지 않을때 구독 취소 (unsubscribe 함수 호출)
  */
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null; //처음에는 null값

    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"), //createdAt을 기준으로 desc(내림차순!)
        //todo: 페이지네이션 설정
        limit(25) //데이터 25개만 불러오도록 설정
      );

      //데이터 문서를 한 번만 가져오는 대신 쿼리에 리스너 추가
      //리스너로 받아오는 거니까 실시간으로 변경됨! (새로고침 없이 화면에 자동 반영)
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };

    fetchTweets();

    //언마운트 될 때(timeline 컴포넌트를 보고 있지 않을 때!), cleanup 실행
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
