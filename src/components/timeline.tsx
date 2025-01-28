import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";

export interface ITweet {
  photo: string;
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
    snapshot.docs.forEach((doc) => console.log(doc.data())); //forEach로 각 문서에 접근하고 문서 데이터 출력
  };

  return <Wrapper>{JSON.stringify(tweets)}</Wrapper>;
}
