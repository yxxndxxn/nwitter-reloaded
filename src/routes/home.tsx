import { auth } from "../firebase";

export default function Home() {
  const logOut = () => {
    auth.signOut(); //로그아웃
    console.log("로그아웃");
  };

  return (
    <h1>
      <button onClick={logOut}>로그아웃</button>
    </h1>
  );
}
