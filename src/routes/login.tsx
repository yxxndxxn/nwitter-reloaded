import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GoogleButton from "../components/google-btn";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //계정 생성할 때 true
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //성별, 나이, 학교, 흡연 여부, 연락처(카카오톡 ID...? ㅇㅇ)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    //모든 input에 name을 넣은 이유..
    //요렇게 하면 input이 변경되었을 때, 어떤 input이 변경되었는지 찾을 수 있음!
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); //에러 메시지 초기화

    console.log(email, password);
    if (loading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      //홈 페이지로 이동
      navigate("/"); //계정 생성, 사용자 프로필 업데이트 후 홈 이동
    } catch (e) {
      //setError
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호: 최소 6글자 이상 입력해주세요."
          type="password"
          required
        />
        <Input type="submit" value={loading ? "Loading" : "로그인"} />
      </Form>

      {/*에러 메시지*/}
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        <Link to="/reset-password">비밀번호 찾기</Link>
        <Link to="/create-account">회원가입</Link>
      </Switcher>
      <GoogleButton />
    </Wrapper>
  );
}
