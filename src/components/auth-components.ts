import styled from "styled-components";

export const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 42px;
`;
export const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const Input = styled.input`
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

export const Error = styled.span`
  font-weight: 500;
  color: #ed4848;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    font-size: 13px;
    color: gray;
  }
`;
