import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./routes/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      //Layout이 Home, Profile을 감싸고 있으니! Layout을 ProtectedRoute로 감싸기!
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  //login, create-account는 Layout으로 감싸지 않기 위해서 밖으로 뺀겨
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

//디폴트 스타일 설정(검은배경, 흰 글씨...)
const GlobalStyles = createGlobalStyle`${reset};
*{
  box-sizing: border-box;
}
body{
background-color: black;
color:white;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;
function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady(); //최초 인증 상태가 완료될 때 실행되는 Promise를 return
    //  로그인 여부를 확인하는 동안 기다리겠따는 뜻..
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
