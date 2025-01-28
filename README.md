## vite<br/>
: go로 작성된 esebuilder를 사용해서 Webpack5보다 최대 100배 빠른 빌드 속도를 냄

`createUserWithEmailAndPassword`: 계정 생성(email, password) <br/>
`updateProfile`: 사용자 이름 설정

---- 
## [timeline 컴포넌트]
### `query`
기본적으로 쿼리는 쿼리를 만족하는 모든 document를 document ID별로 *오름차순*으로 검색합니다. <br/> <br/>
`orderBy()`를 사용하여 *데이터의 정렬 순서를 지정*할 수 있음<br/>
`limit()`를 사용하여 검색되는 *document 수를 제한*할 수 있습니다.(값은 0보다 크거나 같아야 함)
https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data


### `onSnapshot`
`onSnapshot`은 특정 문서나 컬렉션, 쿼리 이벤트를 감지하여 realtime으로 이벤트콜백 함수를 실행해줄 수있다. 이를통해 db에 들어온 쿼리를 새로고침없이 화면에 반영할 수있다.

`onSnapshot`을 사용할 때는 비용을 지불해야한다.
유저가 다른 화면을 보고있으면 작동하지 않게해주는것이 좋다.
`useEffect`의 `cleanup` 기능을 이용하여 컴포넌트가 언마운트될 때 (트윗 타임라인 컴포넌트 화면에서 해제될때) `onSnapshot`이 실행되지 않도록 할수 있다.

`onSnapshot`은 실행되면서 해당 이벤트리스닝의 *구독을 해제하는 함수*를 반환한다.

const 변수선언 및 할당을 해주고, useEffect의 return으로 해당 함수를 실행시켜주면된다.
https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
