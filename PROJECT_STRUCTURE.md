# YouTube AI Summarizer & TTS - 프로젝트 구조

## 📂 전체 파일 트리

```
aianalysis/
│
├── backend/                           # NestJS 백엔드
│   ├── src/
│   │   ├── summary/                   # Summary 기능 모듈
│   │   │   ├── dto/
│   │   │   │   ├── create-summary.dto.ts        # 요청 DTO (URL 검증)
│   │   │   │   └── summary-response.dto.ts      # 응답 DTO
│   │   │   ├── summary.controller.ts            # POST /api/summary 엔드포인트
│   │   │   ├── summary.service.ts               # 핵심 비즈니스 로직
│   │   │   └── summary.module.ts                # Summary 모듈
│   │   │
│   │   ├── common/                    # 공통 유틸리티
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts     # 글로벌 에러 핸들러
│   │   │
│   │   ├── app.module.ts              # 루트 모듈
│   │   └── main.ts                    # 애플리케이션 엔트리 포인트
│   │
│   ├── public/
│   │   └── audio/                     # TTS 오디오 파일 저장소
│   │       └── .gitkeep
│   │
│   ├── package.json                   # 백엔드 의존성
│   ├── tsconfig.json                  # TypeScript 설정
│   ├── nest-cli.json                  # NestJS CLI 설정
│   └── .env.example                   # 환경 변수 템플릿
│
├── frontend/                          # Next.js 프론트엔드
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root Layout (메타데이터, SEO)
│   │   ├── page.tsx                  # 메인 페이지
│   │   ├── providers.tsx             # React Query Provider
│   │   └── globals.css               # 글로벌 스타일
│   │
│   ├── components/                   # React 컴포넌트
│   │   ├── InputForm.tsx             # YouTube URL 입력 폼
│   │   ├── ProcessIndicator.tsx      # 3단계 프로세스 표시
│   │   ├── ResultCard.tsx            # 요약 결과 카드
│   │   ├── AudioPlayer.tsx           # 커스텀 오디오 플레이어
│   │   └── ErrorMessage.tsx          # 에러 메시지 표시
│   │
│   ├── store/                        # Zustand 상태 관리
│   │   └── useSummaryStore.ts        # 요약 상태 스토어
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   └── useSummary.ts             # React Query 훅
│   │
│   ├── lib/                          # 유틸리티
│   │   └── api.ts                    # Axios API 클라이언트
│   │
│   ├── package.json                  # 프론트엔드 의존성
│   ├── tsconfig.json                 # TypeScript 설정
│   ├── tailwind.config.ts            # Tailwind CSS 설정
│   ├── postcss.config.js             # PostCSS 설정
│   ├── next.config.js                # Next.js 설정
│   └── .env.local.example            # 환경 변수 템플릿
│
├── README.md                          # 프로젝트 문서
├── PROJECT_STRUCTURE.md               # 이 파일
└── .gitignore                         # Git 제외 파일
```

## 🔄 데이터 플로우

### 1. 사용자 입력 → 요약 생성

```
[사용자] 
  ↓ YouTube URL 입력
[InputForm.tsx]
  ↓ useSummary() 훅 호출
[hooks/useSummary.ts]
  ↓ React Query 뮤테이션
[lib/api.ts]
  ↓ POST /api/summary
[Backend: summary.controller.ts]
  ↓ CreateSummaryDto 검증
[Backend: summary.service.ts]
  ↓
  ├─ extractTranscript() → YouTube Transcript API
  ├─ summarizeTranscript() → OpenAI GPT-4
  └─ generateTTS() → OpenAI TTS
  ↓
[Frontend: useSummaryStore]
  ↓ 상태 업데이트
[ResultCard.tsx + AudioPlayer.tsx]
  ↓
[사용자에게 결과 표시]
```

### 2. 상태 관리 플로우

```
[Zustand Store]
  ├─ stage: 'idle' | 'extracting' | 'summarizing' | 'generating' | 'complete' | 'error'
  ├─ result: SummaryResult | null
  ├─ error: string | null
  └─ isLoading: boolean

[컴포넌트별 상태 구독]
  ├─ InputForm → isLoading
  ├─ ProcessIndicator → stage
  ├─ ResultCard → result
  └─ ErrorMessage → error
```

## 🏗️ 아키텍처 패턴

### Backend (NestJS)

```
Controller (Routing)
    ↓
Service (Business Logic)
    ↓
External APIs (OpenAI, YouTube)
    ↓
DTO (Validation & Response)
```

**핵심 원칙**:
- **단일 책임 원칙**: Controller는 라우팅, Service는 로직
- **의존성 주입**: NestJS IoC Container
- **Validation**: class-validator를 통한 DTO 검증
- **Error Handling**: Global Exception Filter

### Frontend (Next.js)

```
page.tsx (Route)
    ↓
Components (Presentation)
    ↓
Hooks (Business Logic)
    ↓
Store (Global State)
    ↓
API Client (Backend 통신)
```

**핵심 원칙**:
- **컴포넌트 분리**: 단일 책임, 재사용성
- **상태 관리 분리**: Zustand (global) + React Query (server)
- **타입 안정성**: TypeScript strict mode
- **스타일 일관성**: Tailwind CSS 유틸리티

## 📦 주요 기술 스택 매핑

| 계층 | 기술 | 역할 |
|------|------|------|
| **Frontend Framework** | Next.js 14 | App Router, SSR, 라우팅 |
| **UI Library** | React 18 | 컴포넌트 기반 UI |
| **Styling** | Tailwind CSS | 유틸리티 퍼스트 CSS |
| **State (Global)** | Zustand | 경량 전역 상태 관리 |
| **State (Server)** | React Query | 비동기 데이터 캐싱/동기화 |
| **HTTP Client** | Axios | RESTful API 통신 |
| **Backend Framework** | NestJS | 모듈형 Node.js 프레임워크 |
| **Validation** | class-validator | DTO 검증 |
| **AI (Summarization)** | OpenAI GPT-4 | 트랜스크립트 요약 |
| **AI (TTS)** | OpenAI TTS | 텍스트 → 음성 변환 |
| **YouTube Data** | youtube-transcript | 자막 추출 |

## 🎯 핵심 파일 설명

### Backend

| 파일 | 역할 | 중요도 |
|------|------|--------|
| `summary.service.ts` | **핵심 로직**: YouTube → 요약 → TTS | ⭐⭐⭐ |
| `summary.controller.ts` | API 엔드포인트 정의 | ⭐⭐ |
| `create-summary.dto.ts` | URL 검증 (Regex) | ⭐⭐ |
| `http-exception.filter.ts` | 에러 표준화 | ⭐⭐ |
| `main.ts` | 서버 부트스트랩, CORS | ⭐⭐ |

### Frontend

| 파일 | 역할 | 중요도 |
|------|------|--------|
| `page.tsx` | 메인 UI 통합 | ⭐⭐⭐ |
| `useSummary.ts` | React Query 비동기 로직 | ⭐⭐⭐ |
| `useSummaryStore.ts` | Zustand 상태 관리 | ⭐⭐⭐ |
| `ResultCard.tsx` | 요약 결과 표시 | ⭐⭐ |
| `AudioPlayer.tsx` | 커스텀 오디오 UI | ⭐⭐ |
| `ProcessIndicator.tsx` | 프로세스 시각화 | ⭐⭐ |
| `InputForm.tsx` | URL 입력 폼 | ⭐⭐ |

## 🚀 확장 가능성

### 추가할 수 있는 기능들

1. **다국어 지원**: 영어, 일본어 등 다양한 언어 자막 처리
2. **요약 스타일 선택**: 간결형 / 상세형 옵션
3. **사용자 인증**: 사용 이력 저장, 즐겨찾기
4. **요약 공유**: SNS 공유, PDF 다운로드
5. **Batch 처리**: 여러 비디오 동시 요약
6. **음성 옵션**: TTS 목소리 선택 (남성/여성/억양)
7. **플레이리스트 요약**: YouTube 재생목록 전체 요약

### 아키텍처 개선 방향

- **Database 추가**: PostgreSQL, MongoDB 등으로 요약 결과 영구 저장
- **File Storage**: S3, GCS 등 클라우드 스토리지로 오디오 관리
- **Queue System**: Bull, RabbitMQ로 긴 작업 비동기 처리
- **Caching**: Redis로 중복 요청 캐싱
- **Monitoring**: Sentry, DataDog 등으로 에러 추적

---

**이 구조는 확장 가능하고 유지보수가 쉬운 모던 풀스택 아키텍처를 따릅니다.**
