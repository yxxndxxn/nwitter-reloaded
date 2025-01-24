//Firebase에 유저 정보 요청
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(auth.currentUser); //유저가 로그인 했는지 여부 알려줌(user 값 넘기거나 null)
  console.log("로그인 확인", user);

  useEffect(() => {
    //로그아웃 -> login 페이지 이동
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!user) {
    //user === null
    return <Navigate to="/login" />;
  }

  return children; //Home, Profile
}
