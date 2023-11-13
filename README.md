# RizzPick

![프로젝트소개](https://github.com/RizzPick/RizzPick-frontEnd/assets/111734939/ab3ea87f-68ca-42c6-821c-496a3ddc1bf0)

# 매력적인 데이트, 맞춤형 매치 \_그 시작은 <b>RizzPick!</b>

<span>📎 https://rizzpick.com</span>

## 프로젝트 소개

> "우리 뭐할까요?"라는 질문에서 출발해 사용자들이 매력적인 데이트 계획을 통해 깊고 의미 있는 관계를 맺을 수 있도록 유도하고자 합니다.

---

## ✅ 서비스 핵심 기능

### **1. 데이트 계획 공유 및 선택**

> 사용자들이 개인적으로 기획한 데이트 아이디어를 공유하고, 상대방의 계획을 보며 선택하는 기능입니다.

### **2. 개인 프로필 기반 추천**

> 지역, 성별을 기반으로 상대방과의 추천이 이루어집니다.

---

## 🗓 프로젝트 기간

2023년 10월 4일 ~ 2023년 11월 15일 (6주)

---

## 사용 기술스택

### Environment

![git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![b](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![v](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![g](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![f](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

## Development

<div>
	<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white" />
	<img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white" />
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat&logo=Tailwind CSS&logoColor=white" />
  <img src="https://img.shields.io/badge/SWR-000000?style=flat&logo=SWR&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=Axios&logoColor=white" />
</div>

---

## ⚙️ 서비스 아키텍처

![ServiceArc](https://github.com/RizzPick/RizzPick-backend/assets/114673187/8279253d-1b33-454b-ab92-b62182f049b2)

## 기술적 의사 결정

<table>
  <th>사용 기술</th>
  <th>결정 사유</th>
  <tr>
    <td>Vercel</td>
    <td>Github를 통해 자동 빌드 및 배포가 가능한 것에 더불어, 배포 최적화로 개발 프로세스가 간단해짐.</td>
  </tr>
  <tr>
    <td>Axios</td>
    <td>Next.js 에서 권장하는 Data Fetching 방식인 Fetch 대신 Axios를 선택한 이유는 baseURL, 공통 헤더 등 반복적으로 작성되어야 하는 코드들을 줄일 수 있다는 점과 Promise기반으로 동작하며, 이로 인해 동기 처리를 간결하고 쉬운 방식으로 할 수 있어서 입니다.</td>
  </tr>
  <tr>
    <td>Next.js</td>
    <td>React를 완전체 프레임워크로 사용하기 위해 선택함. 프로젝트에서 특성 상 많은 양의 이미지들을 사용하는데 이 부분에서 Next.js의 이미지 용량 최적화 + lazy loading 활성화 + placeholder 기능이 유용하다고 생각되었습니다.
또한 스크립트, 링크 등의 강력한 내장 라이브러리를 통해 효율적으로 최적화를 진행하고, 각 페이지와 컴포넌트에 따라 csr, ssr, ssg를 취사선택하여 효율적인 서비스를 제공하는데에 용이하고 또한, 코드스플리팅을 통해 각 페이지의 초기 렌더링 JS 양을 줄일 수 있습니다.</td>
  </tr>
  <tr>
    <td>Typescript</td>
    <td>런타임에러를 컴파일 시점에 잡아낼 수 있어 안정적인 코드 운용이 가능함. 명확한 타입 정보를 제공하여 가독성이 좋기에 프로젝트 규모의 크기를 불문하고 유지보수가 용이함. 또한, JS 라이브러리나 프레임워크를 그대로 사용할 수 있다는 점이 강점이있다고 판단함.</td>
  </tr>
  <tr>
    <td>Tailwind CSS</td>
    <td>테일윈드 css는 반응형 디자인을 쉽게 구현 할 수 있어 선택을 하게 되었습니다.
최적화된 css를 생성함으로써 웹사이트의 로딩 속도를 향상시키고 성능 최적화 할 수 있다는 부분도 컸던 것 같습니다.
또한, 팀원들 간의 일관된 코드 베이스를 유지 할 수 있으며, 프로젝트의 유지 보수성을 향상 시킬 수 있습니다.</td>
  </tr>
  <tr>
    <td>SWR</td>
    <td>프로젝트 내에서 관리되어야 할 State를 구분한 결과, 대부분의 데이터들이 Server State 들이고, Global State 및 Local State 의 필요성이 부족하다고 판단되었고  일반적인 상태 관리 라이브러리인 Recoil, Zustand, Redux를 제외하고 SWR과 React Query 중에서 고민해 본 결과, Next.js 프레임워크와 관련깊은 SWR을 사용하기로 결정하였지만 만일 관리되어야 하는 데이터의 구조가 조금 더 복잡했다면 React Query를 사용했을 것 같습니다. </td>
  </tr>
  <tr>
    <td>Middleware</td>
    <td>Middleware 와 Axios Interceptor 의 토큰 검증 방식에서 Next.js 미들웨어를 사용하면 각 페이지 렌더링 전에 토큰을 검증할 수 있습니다. 이는 모든 페이지에서 공통적으로 필요한 로직을 중앙화하여 관리할 수 있게 합니다.</td>
  </tr>
</table>

## 🛠트러블슈팅

<details>
<summary>채팅 관련 메시지 전송 과정에서 이벤트가 두 번 발생하는 이슈</summary>
<div markdown="2">

> 문제

-   onKeyDown 를 사용해서 메시지 전송 처리를 할 때 한글로 내용을 작성후 엔터 키를 입력하면 이벤트가 두번 발생하는 이슈
-   한글을 입력할 때 자세히 보면 입력 중인 글자 바로 아래에 검은 밑줄이 생기는 경우가 있는데, 이 밑줄이 보이는 상황에서 `Enter`키를 입력하면 이벤트가 2번 발생하는 이슈가 있다. 왜냐하면 글자가 조합 중인 건지, 조합이 끝난 상태인지 파악하기가 어렵기 때문이다.

> 오류 해결 시도

-   onKeyPress 로 변경해서 처리하니 해결되었지만 다음과 같은 문제점들이 있었다.

```jsx
onKeyDown: keycode 값 - 한/영, Shift, Backsapce 등 인식 가능
onKeyPress: ASCII 값 - 한/영, Shift, Backsapce 등 인식 불가
```

> 오류 해결 방법

-   `KeyboardEvent.isComposing`은 입력한 문자가 조합문자인지 아닌지를 판단한다. 한글은 자음과 모음의 조합으로 한 음절이 만들어지기 때문에 조합문자이고, 영어는 조합문자가 아니다.

```jsx
const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter') {
        onClick();
    }
};
```

</div>
</details>

<details>
<summary>서버 컴포넌트에서 Axios 인스턴스를 사용한 Data Fetching 작업 시 에러 발생</summary>
<div markdown="3">

> 문제

-   유저의 채팅 리스트를 불러오는 /user/chat/page.tsx 컴포넌트에서 Axios 인스턴스를 사용한 데이터 요칭 시 ‘use client’ 를 붙여야 하는 이슈가 발생
-   서버 컴포넌트에서 Next.js 에서 권장하는 Fetch 를 사용해야 하는 이슈인 줄 알았으나, 우리가 사용하고 있던 Axios 인스턴스의 공통 헤더에 클라이언트에서 사용되는 Cookie를 사용하고 있어서 발생한 문제

> 오류 해결 시도

-   아래 코드와 같이 `useEffect`, `use client` 등을 사용해서 `**SSR**` 방식이 아닌 `**CSR**` 방식으로 동작하게 되면서 해당 컴포넌트와 그 하위에 존재하는 모든 코드가 `**CSR**` 방식으로 동작하게 되는 상황이 발생

```jsx
'use client'
import { useEffect } from 'react';
export default async function ChatPage() {
    useEffect(()=>{
        const getChats = async() => {
            try {
                const response = await ChatAPI.getChats();
                if(response.status === 200){
                    console.log(response);
                }
            } catch(error) {
                console.log(error);
            }
        }
        getChats();
    },[])
```

> 오류 해결 방법

-   Data Fetching이 필요한 컴포넌트에서 Axios를 사용할 때 next/headers 에서 API 요청 시 필요한 토큰 값을 직접 가져와서 전달하는 방식으로 `use client`를 사용하지 않고 Data Fetching 작업을 수행
-   하지만 이 부분에서 또 고민해봐야 하는 점은 서버 컴포넌트에서 상태를 관리하기 위해서는 반드시 클라이언트 컴포넌트를 사용하도록 강제화하고 있기 때문에, `**Data Fetching**` 작업과 동시에 SWR 을 사용해서 전역 상태로 관리할 수가 없다. 따라서 필요한 컴포넌트에 `**props` 로 전달해서 사용해야 한다.\*\*

```jsx
import { cookies } from 'next/headers';
const cookieStore = cookies();
const accessToken = cookieStore.get('Authorization');
const token = accessToken?.value;

if (!token) return;
const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat`,
    {
        headers: {
            Authorization: token,
        },
    }
);
```

</div>
</details>

<details>
<summary>Next.js 조건부 렌더링 과정에서 발생하는 서버에서 사전 렌더링된 HTML과 클라이언트에서 하이드레이션(hydration) 과정에서 생성된 HTML 내용이 일치하는 않는 문제</summary>
<div markdown="4">

> 문제

-   로그인 한 유저가 만일 프로필을 등록하지 않은 유저라면 로그인 시 쿠키에 저장한 status : "false" 의 값을 가져와서 해당 값에 따라 "프로필 등록" : "프로필 수정" 이라는 조건부 렌더링을 수행하는 과정에서 발생

> 오류 해결 시도

-   쿠키 동기화 : 서버와 클라이언트 모두에서 쿠키에 접근하여 초기 렌더링 시 동일한 값을 가지고 시작해야 한다, Next.js 13 버전의 서버 컴포넌트에서 쿠키를 읽고, 페이지의 props로 전달하여 클라이언트 사이드와 SSR 사이드 모두 동일한 상태를 기반으로 렌더링할 수 있도록 하기.
-   클라이언트 사이드 렌더링(CSR) : 쿠키 값에 따라 렌더링을 달리할 경우, 해당 부분을 CSR로 전환하여 클라이언트 사이드에서만 렌더링되도록 합니다. 이 경우, 서버 사이드에서는 이 부분을 렌더링하지 않고 클라이언트 사이드의 JavaScript가 로드된 후에 DOM을 업데이트함
-   상태 초기화 : 서버에서 쿠키를 읽을 수 없는 경우(예: 사용자가 로그인하지 않았을 때), 상태를 'unknown' 같은 기본값으로 초기화하고 클라이언트 사이드에서 쿠키를 읽은 후에 상태를 업데이트합니다. 이 방법은 첫 번째 렌더링에서는 중립적인 컨텐츠를 보여주고, 클라이언트 사이드 스크립트가 로드된 후에 실제 컨텐츠로 전환합니다.

> 오류 해결 방법

코드에서 사용하고 있던 로직중에 매번 컴포넌트가 렌더링 될 때, useSWR를 사용하여 관리되는 profile 데이터에서 status 값을 사용하는 것으로 클라이언트 사이드에서의 상태 관리를 서버의 데이터와 동기화함.

> 고려해 볼 부분

-   **초기 로딩 상태**
-   **하이드레이션 오류**
-   **서버 사이드 렌더링(SSR) 및 정적 생성(SSG)**: `useSWR`은 클라이언트 사이드에서 작동하므로, 서버 사이드 렌더링이나 정적 생성을 사용하는 경우 페이지에서 `useSWR`로 데이터를 가져오기 전에 서버에서 렌더링된 데이터가 필요할 수 있다.

💡 따라서 해당 데이터, 즉 `profile` 을 `SWR`로 관리해서 전역으로 사용하는 것도 좋지만 서버 컴포넌트에서 우선적으로 `Data Feching` 작업을 수행하고 해당 데이터를 `props`로 전달해서 서버 사이드에서 데이터를 불러와 해당 데이터로 서버에서 렌더링 한 결과와 클라이언트에서 추후 진행되는 `hydration` 과정에서의 불일치를 줄이는 것이 중요해 보인다.

</div>
</details>

<details>
<summary>SSE가 마운트 될 때마다 연결 요청을 하는 이슈</summary>
<div markdown="5">

> 문제

-   SSE가 오류 또는 타임아웃이 일어나지 않아도 페이지가 렌더링 될 때마다 연결요청을 하는 이슈가 발생
-   위와 같은 내용으로 인해 각 페이지 이동 시 pending, 로딩만 이루어지는 현상 발생

> 오류 해결 시도

-   Header에 SSE연결은 진행한 상태로 최상위 파일에 Header를 연결하여 최초 렌더링 시에만 연결이 이루어지도록 설정
-   Header가 필요하지 않은 컴포넌트도 Header가 생겨 전역상태관리로 SSE연결 context파일을 생성하고, 최상위 Layout에 감싼 뒤 최초화면, 로그인 페이지등 SSE연결이 필요하지 않는 페이지에서는 token이 없으면 return하여 SSE연결 로직을 불러오지 않도록 설정

```jsx
<html lang="ko">
    <head>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />
        <meta name="msapplication-tap-highlight" content="no" />
    </head>
    <body style={{ fontFamily: 'SUITE' }}>
        <EventSourceProvider>
            {' '}
            //SSE연결을 관리하는 Context API파일
            <ChatProvider>
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 1500 }}
                />
                {children}
            </ChatProvider>
        </EventSourceProvider>
    </body>
</html>
```

> 오류 해결 방법

-   위에 기재한 코드 및 설명과 같이 전역상태 관리 및 최상위 폴더에 위치시킴으로 한 번만 연결 될 수 있도록 설정
-   아래 코드는 SSE연결이 필요하지 않는 페이지에서 SSE연결을 하지 않도록 하는 코드

```JSX
useEffect(() => {
        if (!token) {
            console.log('너 토큰 없잖아');
            return;
        } else {
            const es = new EventSourcePolyfill(
                'https://willyouback.shop/subscribe',
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'text/event-stream',
                        Connection: 'keep-alive',
                        'Cache-Control': 'no-cache',
                    },
                    heartbeatTimeout: 3600000, // 1 hour
                }
            );
            console.log();
            // EventSource 객체를 상태에 설정합니다.
            setEventSource(es);

            // 컴포넌트가 언마운트될 때 EventSource를 닫습니다.
            return () => {
                console.log("SSE 언마운트");
                es.close();
            };
        }
    }, [token]);
```

</div>
</details>

<details>
<summary>데이트 계획 : 활동 추가 후 바로 삭제처리가 되지않는 이슈</summary>
<div markdown="6">

> 문제

-   데이트 계획 작성 시 데이트에서 할 활동을 추가하게 된다.
-   활동을 추가한 뒤 생성되는 데이터는 x버튼을 통해 삭제 할 수 있는데, 작성완료 후 수정단계에서는 삭제가 되나 활동 추가 직후에는 삭제가 되지않는 이슈가 있음

> 오류 해결 시도

-   console로 데이터가 어떤 식으로 추가되는지 확인
-   활동 추가 후 activityId가 undefined로 나오는 걸 확인하여, activityId를 정상적으로 받아올 수 있도록 설정

> 오류 해결 방법

-   위와 같은 시도로 삭제 하려는 activity의 id를 지정하여 정상 삭제 될 수 있도록하여 해결

```JSX
// Activity 추가 시
setActivities([
                        ...activities,
                        {
                            id: activityResponse.data.activityId,
                            content: activityContent,
                        },
                    ]);

// Activity 삭제 시
const deleteActivity = async (id: number) => {
        try {
            const response = await PlanAPI.deleteActivity(id);
            if (response.status === 200) {
                setActivities(
                    activities.filter((activity) => activity.id !== id)
                );
            } else {
                console.error(
                    'Failed to delete activity:',
                    response.data.message
                );
            }
        } catch (error) {
            console.error('Failed to delete activity:', error);
        }
        console.log('null?', id);
    };
```

</div>
</details>

## 🧑🏻‍💻 팀원 소개

| 이름       | 역할   | 깃허브 주소                   |
| ---------- | ------ | ----------------------------- |
| 정우용 (B) | 팀장   | https://github.com/jwywoo     |
| 소석진 (F) | 부팀장 | https://github.com/seokjin909 |
| 김연수 (F) | 팀원   | https://github.com/Xeonxoo99  |
| 전진웅 (B) | 팀원   | https://github.com/JJW11111   |
| 김우응 (B) | 팀원   | https://github.com/Gimwooeung |
| 이재하 (B) | 팀원   | https://github.com/jaeha0183  |

## [프론트 깃허브 링크](https://github.com/RizzPick/RizzPick-backend)

## [백엔드 깃허브 링크](https://github.com/RizzPick/RizzPick-frontEnd)
