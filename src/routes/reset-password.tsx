import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Form,
  Error,
  Input,
  Title,
  Wrapper,
  Switcher,
} from "../components/auth-components";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //계정 생성할 때 true
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); //에러 메시지 초기화

    if (loading || email === "") return;
    try {
      setLoading(true);
      //todo: 유효한 이메일인지 확인 후 메일 발송해야 하는데,, 안돼.. why!!
      if (auth) {
        await sendPasswordResetEmail(auth, email);
        alert("이메일 전송이 완료되었습니다.");
        navigate("/login"); //이메일 전송 후 홈 이동
      } else {
        setError("가입된 이메일이 아닙니다.");
      }
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
      <Title>비밀번호 재설정</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="가입한 이메일을 입력해 주세요"
          type="email"
          required
        />

        <Input type="submit" value={loading ? "Loading" : "이메일 전송하기"} />
      </Form>

      {/*에러 메시지*/}
      {error !== "" ? <Error>{error}</Error> : null}

      <Switcher>
        <Link to="/login">로그인</Link>
      </Switcher>
    </Wrapper>
  );
}
