import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

const Title = styled.h1`
  font-size: 42px;
`;
const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Input = styled.input`
  width: 100%;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8; //투명도로도 조정 가넝하구나..! 욜~
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: #ed4848;
`;
export default function CreateAccount() {
  const [Loading, setLoading] = useState(false); //계정 생성할 때 true
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    //모든 input에 name을 넣은 이유..
    //요렇게 하면 input이 변경되었을 때, 어떤 input이 변경되었는지 찾을 수 있음!
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, email, password);
    try {
      //계정 만들기
      //사용자의 이름 설정
      //홈 페이지로 이동
    } catch (e) {
      //setError
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
          name="name"
          value={name}
          placeholder="이름"
          type="text"
          required
        />
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
          placeholder="비밀번호"
          type="password"
          required
        />
        <Input type="submit" value={Loading ? "Loading" : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
