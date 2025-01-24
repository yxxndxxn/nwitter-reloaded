//Firebase에 유저 정보 요청
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; //유저가 로그인 했는지 여부 알려줌(user 값 넘기거나 null)
  console.log("로그인 확인", user);

  if (!user) {
    //user === null
    return <Navigate to="/login" />;
  }
  return children; //Home, Profile
}
