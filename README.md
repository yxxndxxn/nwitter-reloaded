## vite<br/>

: go로 작성된 esebuilder를 사용해서 Webpack5보다 최대 100배 빠른 빌드 속도를 낸다

`createUserWithEmailAndPassword`: 계정 생성(email, password) <br/>
`updateProfile`: 사용자 이름 설정

---

## [Timeline 컴포넌트]

### `query`

기본적으로 쿼리는 쿼리를 만족하는 모든 document를 document ID별로 *오름차순*으로 검색합니다. <br/> <br/>
`orderBy()`를 사용하여 *데이터의 정렬 순서를 지정*할 수 있음<br/>
`limit()`를 사용하여 검색되는 *document 수를 제한*할 수 있음(값은 0보다 크거나 같아야 함)
https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data

### `onSnapshot`

`onSnapshot`은 특정 문서나 컬렉션, 쿼리 이벤트를 감지하여 realtime으로 이벤트콜백 함수를 실행해줄 수있다. 이를통해 db에 들어온 쿼리를 새로고침없이 화면에 반영할 수 있다.

`onSnapshot`을 사용할 때는 비용을 지불해야한다.
유저가 다른 화면을 보고있으면 작동하지 않게해주는것이 좋다.
`useEffect`의 `cleanup` 기능을 이용하여 컴포넌트가 언마운트될 때 (트윗 타임라인 컴포넌트 화면에서 해제될때) `onSnapshot`이 실행되지 않도록 할수 있다.

`onSnapshot`은 실행되면서 해당 이벤트리스닝의 *구독을 해제하는 함수*를 반환한다.

const 변수선언 및 할당을 해주고, useEffect의 return으로 해당 함수를 실행시켜주면된다.
https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development

## [Tweet 컴포넌트]

### `삭제`

firebase에서 트윗을 삭제하려면 doc함수를 사용하여 db에서 해당 tweet을 찾고, deleteDoc함수에 입력해주어야 한다 (doc함수의 인자: db, document 이름, id)<br/>
트윗에 사진이 포함되어 있다면, 사진도 별도로 삭제하는 작업이 필요하다.
-> 이때 쉽게 삭제할 수 있도록 사진의 저장 경로를 수정(유저ID/docID) <br/>

Document 삭제: `deleteDoc`
https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents <br/>

파일 삭제: `deleteObject`
파일을 삭제하려면 먼저 해당 파일에 대한 reference를 만듭니다. 그런 다음 해당 reference에 대해 delete() 메서드를 호출합니다.

````if(photo){
const photoRef =ref(storage,`tweets/${userId}/${docId}`);
await deleteObject(photoRef);
}```
https://firebase.google.com/docs/storage/web/delete-files#delete_a_file
````

## [Profile 컴포넌트]
#### 사용자의 tweets만 가져오는 query 만들기
그냥 데이터를 가져오는 것 이외에 where이나 orderBy를 사용해서 다른 순서로 가져오거나, 필터링해서 가져오고 싶으면 Firebase와 Firestore에 더욱 자세히 알려줘야 함(미리 해당 정보들을 주어야 함)!

firebase가 제공하는 `query`의 `where`옵션을 사용하여 읽어올 데이터를 필터링 할 수 있음
`where`에는 3개의 파라미터가 필요함
- doc의 field
- 연산자
- 내가 원하는 조건
```where("userId", "==", user?.uid),```
(쿼리를 날린 후 브라우저의 콘솔에서 설정창링크를 확인할 수 있음)


## 배포
#### firebase의 Hosting 사용
실제로 bundle이 어디에 빌드되는지 확인해보았을 때(`npm run build`), Vite 프로젝트에서 나의 product 모든 것을 압축하여 저장하는 폴더는 `dist`임을 알 수 있었음
(`npm run build`를 실행하면 vite가 dist 폴더를 만들어줌)
👉 Firebase에서 배포할 폴더는 `dist`인 것! 
👉 Firebase야~ dist 폴더를 cloud에 업로드 해죠잉~

재배포 시 npm run deploy를 터미널에 입력하면 됨!

#### package.json 수정(`deploy`, `predeploy`)
- ```"deploy": "firebase deploy"```
- ```"predeploy": "npm run build"```
👉 deploy를 실행하면 `npm run build`를 통해 `tsc`와 `vite build`가 실행
👉 그 후에 Firebase deploy가 실행되어 `dist`폴더를 Firebase cloud에 배포하게 됨

#### Firebase Security Rules
: Firebase 데이터베이스(Realtime Database나 Firestore)에 대한 액세스를 제어하는 역할
👉 이를 통해 데이터의 읽기 및 쓰기 권한을 정의하고, 사용자 인증 상태와 데이터 구조에 따라 특정 조건을 설정할 수 있습니다.

[주요 역할]
- **접근 제어**: 특정 사용자나 사용자 그룹에 대해 데이터에 대한 읽기/쓰기 권한 설정
- **데이터 유효성 검사**: 데이터가 데이터베이스에 저장되기 전에 유효성을 검사하여 잘못된 형식이나 불필요한 데이터가 들어가지 않도록 함
- **보안 강화**: 민감한 데이터를 보호하고, 외부 공격으로부터 데이터베이스를 안전하게 지킴
- **개발 및 운영 관리**: 개발 단계에서 적절한 권한을 설정하여 사용자 경험을 관리하고, 운영 단계에서 데이터 접근을 제어

Cloud Firestore 보안 규칙
https://firebase.google.com/docs/firestore/security/get-started

Cloud Storage 보안 규칙
https://firebase.google.com/docs/storage/security

