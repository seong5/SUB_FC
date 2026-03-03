# ⚽︎ SUB-FC

<img width="400" height="400" alt="SUB-FC" src="https://github.com/user-attachments/assets/eb6b4ec0-026a-4b9f-b427-596bb2283156" />

## ‼️ SUB-FC 란?

- SUB-FC 의 구성원들이 모든 순간을 기록하고 공유하는 서비스입니다. 

- 경기기록, 선수정보, 팀 일정까지 모두 확인할 수 있습니다.

- 현재 지속적인 피드백 요청을 통해 기능 추가/수정 등 개발중입니다.

## 📚 기술 스택

| 분류                  | 항목                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 언어                  | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white)                                                                                                                                                                                                                                                                                |
| 프론트엔드 프레임워크 | <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white">                                                                                                                                                                                             |
| 스타일링              | <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=TailwindCSS&logoColor=white">                                                                                                                                                                                                                                                                                 |
| 상태 관리             | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=Zustand&logoColor=white) ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=ReactQuery&logoColor=white)                                                                                                                                                                              |
| API 통신              | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)                                                                                                                                                                                                                                                                                               |
| 패키지 매니저         | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)                                                                                                                                                                                                                                                                                                  |
| 코드 품질 도구        | <img src="https://img.shields.io/badge/Eslint-4B32C3?style=flat&logo=Eslint&logoColor=white"> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=Prettier&logoColor=white">                                                                                                                                                                                         |
| 배포 및 CI/CD         | <img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=Vercel&logoColor=white"> ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=GitHub-Actions&logoColor=white)                                                                                                                                                                      |
| 협업 도구             | <img src="https://img.shields.io/badge/Github-181717?style=flat&logo=Github&logoColor=white"> <img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=Notion&logoColor=white">  <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=Figma&logoColor=white"> |
| 테스트             | <img src="https://img.shields.io/badge/Jest-181717?style=flat&logo=Jest&logoColor=#C21325">  |
| 백엔드 및 DB             | <img src="https://img.shields.io/badge/Supabase-181717?style=flat&logo=Supabase&logoColor=#3FCF8E">  |
| 폼 관리 및 유효성 검증            | <img src="https://img.shields.io/badge/Zod-181717?style=flat&logo=Zod&logoColor=#408AFF"> <img src="https://img.shields.io/badge/ReactHookForm-181717?style=flat&logo=React-Hook-Form&logoColor=#EC5990">  |


## 📄 페이지 경로

| 페이지           | 경로                   |
| ---------------- | ---------------------- |
| 로그인           | /login                 |
| 회원가입         | /signup                |
| 메인 화면        | /                      |
| 체험 상세        | /matches/[id]          |
| 팀관리 페이지 | /teams                |
| 선수관리 페이지          | /players           |


## 📂 폴더 구조

```
project-root/
├── node_modules/
├── public/                      # 정적 파일 (파비콘, 공개 이미지 등)
├── src/
│ ├── app/                       # Next.js App Router 페이지, 서버 라우트
│ │ ├── api/                     # 서버 API 엔드포인트
│ │ ├── auth/                    # OAuth 콜백 라우트
│ │ ├── login/                   # 로그인 페이지
│ │ ├── signup/                  # 회원가입 페이지
│ │ ├── mypage/                  # 마이페이지(프로필)
│ │ ├── players/                 # 선수 목록 + 명예의 전당 페이지
│ │ ├── teams/                   # 팀 통계/일정 페이지
│ │ ├── matches/                 # 경기 목록 페이지
│ │ │ └── [matchId]/             # 개별 경기 상세 페이지
│ │ ├── provider/                # React Query, 알림 등 글로벌 Provider
│ │ ├── globals.css              # 전역 스타일
│ │ ├── layout.tsx               # 앱 공통 레이아웃
│ │ └── page.tsx                 # 메인 홈 페이지
│ │
│ ├── assets/                    # SVG 등 정적 에셋 파일
│ │ └── .svg
│ │
│ ├── entities/                  # 도메인 단위
│ │ ├── match/                   # 경기 도메인
│ │ ├── player/                  # 선수 도메인
│ │ ├── team/                    # 팀 도메인
│ │ └── index.ts
│ │
│ ├── features/                  # 특정 기능 단위 UI/로직
│ │ ├── auth/                    # 로그인/회원가입 폼 + 검증
│ │ ├── match-creation/          # 경기 등록 플로우 (결과/명단/쿼터/득점/MOM)
│ │ ├── match-detail/            # 경기 상세(포메이션, 쿼터별 기록, 지도 등)
│ │ ├── player-stats/            # 명예의 전당(득점·도움·참석률·MOM 1위)
│ │ ├── team-stats/              # 팀 승률/승무패 카드
│ │ ├── team-schedule/           # 팀 일정 캘린더 UI
│ │ └── match-search/            # 경기 검색 바 기능
│ │
│ ├── widgets/ # 여러 feature/entity를 조합한 페이지용 블록
│ │ ├── home/                    # 홈 페이지 클라이언트
│ │ ├── match-list/              # 경기 목록 + 검색/정렬/페이지네이션
│ │ ├── match-detail/            # 경기 상세 페이지 클라이언트 래퍼
│ │ ├── player-roster/           # 포지션별 선수 로스터
│ │ ├── team-schedule/           # 팀 일정 위젯 래퍼
│ │ └── layout/ 
│ │
│ ├── shared/                    # 전역 공통 UI/유틸/설정/스토어
│ │ ├── ui/ 
│ │ ├── api/ 
│ │ ├── config/ 
│ │ ├── hooks/ 
│ │ ├── lib/ 
│ │ ├── utils/ 
│ │ ├── types/ 
│ │ └── index.ts
│ │
│ └── widgets/index.ts, features/index.ts, entities/index.ts
│
├── .gitignore
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```
