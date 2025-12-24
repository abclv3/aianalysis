# 🎯 YouTube AI 요약 서비스 - 면접 대비 Q&A

> **프로젝트**: YouTube AI Summarizer with Whisper & GPT-4o-mini  
> **기간**: 2024년 12월  
> **역할**: Full Stack Developer  
> **GitHub**: https://github.com/abclv3/youtube-ai-summarizer

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 선택 이유](#2-기술-스택-및-선택-이유)
3. [핵심 기능 및 구현](#3-핵심-기능-및-구현)
4. [기술적 도전과 해결](#4-기술적-도전과-해결)
5. [성능 최적화](#5-성능-최적화)
6. [보안 및 에러 처리](#6-보안-및-에러-처리)
7. [향후 개선 방향](#7-향후-개선-방향)

---

## 1. 프로젝트 개요

### Q1. 이 프로젝트를 만든 이유는 무엇인가요?

**A:**
긴 YouTube 비디오의 핵심 내용을 빠르게 파악하고 싶은 사용자들을 위해 AI 기반 자동 요약 서비스를 개발했습니다. 특히 다음과 같은 문제를 해결하고자 했습니다:

- ⏰ **시간 절약**: 30분 영상을 3줄 요약으로 1분 안에 파악
- 🎧 **접근성**: 음성이 있는 모든 YouTube 영상 지원 (자막 불필요)
- 🌐 **언어 처리**: Whisper API로 한국어 STT 정확도 향상

---

### Q2. 프로젝트의 주요 기능은 무엇인가요?

**A:**
1. **YouTube 오디오 추출**: yt-dlp를 사용한 고속 다운로드
2. **음성 인식 (STT)**: OpenAI Whisper API로 음성 → 텍스트 변환
3. **AI 요약**: GPT-4o-mini로 3줄 핵심 요약 생성
4. **전체 스크립트 제공**: 접기/펼치기 기능으로 UI 최적화
5. **YouTube 플레이어 통합**: iframe으로 원본 영상 재생

---

## 2. 기술 스택 및 선택 이유

### Q3. 왜 FastAPI를 백엔드로 선택했나요?

**A:**
1. **비동기 처리**: `async/await`로 STT, 요약 등 I/O 작업 효율적 처리
2. **Python 생태계**: yt-dlp, OpenAI SDK와의 완벽한 호환성
3. **자동 문서화**: Swagger UI로 API 테스트 및 문서화 자동 생성
4. **빠른 개발**: Pydantic으로 타입 안전성 보장하면서 빠르게 개발

**Node.js(NestJS)를 고려했지만**:
- Python의 yt-dlp가 Node.js의 ytdl-core보다 훨씬 안정적
- OpenAI Python SDK가 더 성숙함
- AI/ML 통합이 Python에서 더 쉬움

---

### Q4. 프론트엔드는 왜 Next.js를 선택했나요?

**A:**
1. **SSR/CSR 하이브리드**: SEO 최적화 + 클라이언트 인터랙션
2. **TypeScript**: 타입 안전성으로 런타임 에러 사전 방지
3. **최신 기술**: App Router, Server Components 활용
4. **Tailwind CSS**: Munto 스타일의 깔끔한 UI 빠르게 구현

---

### Q5. 왜 GPT-4o-mini를 선택했나요? GPT-4o와의 차이는?

**A:**

| 항목 | GPT-4o | GPT-4o-mini |
|------|--------|-------------|
| **속도** | 2-3초 | **1초 이하** ✅ |
| **비용** | $2.50/1M tokens | **$0.15/1M tokens** (94% 저렴) ✅ |
| **품질** | 최고 | 요약에는 충분히 우수 ✅ |

**요약 작업**에는 GPT-4o-mini의 품질로도 충분하고, **응답 속도**와 **비용 효율**이 훨씬 중요하다고 판단했습니다.

---

## 3. 핵심 기능 및 구현

### Q6. YouTube 오디오 다운로드 과정을 설명해주세요.

**A:**
```python
# 1. yt-dlp로 YouTube에서 오디오만 추출
ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '32',  # 최적화: 파일 크기 85% 감소
    }]
}

# 2. cookies.txt로 봇 탐지 우회
'cookiefile': 'cookies.txt',
'http_headers': {
    'User-Agent': 'Mozilla/5.0...',  # 실제 브라우저처럼 위장
}
```

**핵심 포인트**:
- **품질 최적화**: 192kbps → 32kbps (Whisper는 낮은 품질도 잘 인식)
- **Anti-Bot**: cookies.txt + User-Agent로 YouTube 403 에러 우회
- **캐싱**: 동일 비디오 재요청 시 캐시된 파일 재사용

---

### Q7. Whisper API와 GPT API를 어떻게 연결했나요?

**A:**
```python
# 1. Whisper API로 STT
transcript = openai_client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    language="ko",  # 한국어 최적화
)

# 2. GPT-4o-mini로 요약
response = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[...],
    response_format={"type": "json_object"}  # 구조화된 응답
)
```

**파이프라인**:
```
YouTube URL
  → yt-dlp (오디오 다운로드)
  → Whisper API (STT)
  → GPT-4o-mini (요약)
  → 프론트엔드 (렌더링)
```

---

## 4. 기술적 도전과 해결

### Q8. YouTube 403 Forbidden 에러를 어떻게 해결했나요?

**A:**

**문제**: YouTube가 봇 감지로 yt-dlp 접근 차단 (403 에러)

**해결 방법**:
1. **cookies.txt 사용**: 실제 로그인 세션 쿠키로 인증
2. **User-Agent 변조**: 실제 Chrome 브라우저처럼 위장
3. **HTTP Headers 추가**: `Referer`, `Sec-Fetch-Mode` 등

```python
'http_headers': {
    'User-Agent': 'Mozilla/5.0...',
    'Referer': 'https://www.youtube.com/',
    'Sec-Fetch-Mode': 'navigate',
}
```

**결과**: 403 에러 해결, 안정적인 다운로드

---

### Q9. 500 서버 에러를 어떻게 방지했나요?

**A:**

**문제**: `extract_info()`가 `None`을 반환하여 `.get()` 호출 시 에러

**해결 방법**:
```python
info = ydl.extract_info(url, download=True)

# 🔥 NoneType 체크 (중요!)
if info is None:
    raise HTTPException(
        status_code=400,
        detail="유튜브 영상 정보를 가져올 수 없습니다."
    )

video_title = info.get('title', 'Unknown')
```

**추가 안전 장치**:
- 파일 크기 체크 (25MB Whisper 제한)
- cookies.txt 존재 여부 확인
- FFmpeg 설치 확인

---

### Q10. 에러 처리 전략은 무엇인가요?

**A:**

**계층화된 에러 처리**:

```python
try:
    # 다운로드 로직
except HTTPException:
    raise  # 이미 처리된 에러는 그대로 전달
except Exception as e:
    # 에러 메시지 분석
    if "403" in str(e):
        raise HTTPException(403, "cookies.txt 필요")
    elif "Video unavailable" in str(e):
        raise HTTPException(404, "비디오 없음")
    elif "FFmpeg" in str(e):
        raise HTTPException(500, "FFmpeg 설치 필요")
```

**프론트엔드 에러 표시**:
- 명확한 에러 메시지와 해결 방법 안내
- "다시 시도" 버튼으로 UX 개선

---

## 5. 성능 최적화

### Q11. 처리 속도를 어떻게 최적화했나요?

**A:**

**최적화 전후 비교**:

| 단계 | 최적화 전 | 최적화 후 | 개선율 |
|------|----------|----------|--------|
| 오디오 다운로드 | 10초 | 8초 | 20% ⬇️ |
| Whisper 업로드 | 5초 | 1초 | 80% ⬇️ |
| GPT 요약 | 3초 | 1초 | 66% ⬇️ |
| **총 시간** | **28초** | **20초** | **28% ⬇️** |

**최적화 방법**:
1. **오디오 품질 다운샘플링**: 192kbps → 32kbps (파일 크기 85% 감소)
2. **모델 전환**: GPT-4o → GPT-4o-mini (2-3배 빠름)
3. **캐싱**: 동일 비디오 재요청 시 즉시 응답

---

### Q12. 추가 최적화 계획은?

**A:**

**단기 (구현 가능)**:
1. **Redis 캐싱**: 요약 결과 저장 → 재요청 시 즉시 응답
2. **비동기 병렬 처리**: 메타데이터 가져오기와 다운로드 동시 진행
3. **청크 스트리밍**: Whisper에 오디오를 한 번에 업로드하지 않고 스트리밍

**장기 (인프라 필요)**:
1. **CDN**: 정적 파일 전송 속도 향상
2. **마이크로서비스 분리**: STT, 요약 서버 분리로 확장성 향상
3. **Queue 시스템**: Redis Queue로 부하 분산

---

## 6. 보안 및 에러 처리

### Q13. API 키 보안은 어떻게 관리했나요?

**A:**

**환경 변수 사용**:
```python
# .env 파일 (gitignore에 포함)
OPENAI_API_KEY=sk-...

# 코드에서 사용
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

**보안 체크리스트**:
- ✅ `.env` 파일은 `.gitignore`에 포함
- ✅ `.env.example`로 템플릿만 제공
- ✅ cookies.txt도 gitignore (개인정보)
- ✅ API 키는 절대 하드코딩하지 않음

---

### Q14. CORS 문제는 어떻게 해결했나요?

**A:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**프로덕션에서는**:
```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

---

## 7. 향후 개선 방향

### Q15. 이 프로젝트를 어떻게 개선할 계획인가요?

**A:**

**기능 추가**:
1. **다국어 지원**: 영어, 일본어 등 다양한 언어 STT
2. **요약 스타일 선택**: "3줄 핵심" vs "상세 요약" vs "불렛 포인트"
3. **TTS 기능**: 요약을 음성으로 재생
4. **사용자 계정**: 요약 히스토리 저장

**기술 개선**:
1. **Gemini 2.0 Flash 통합**: 무료 모델로 비용 절감
2. **Vercel + Railway 배포**: 프로덕션 환경 구축
3. **PostgreSQL**: 사용자 데이터 및 캐시 저장
4. **Docker**: 배포 일관성 보장

---

### Q16. 이 프로젝트에서 가장 의미 있었던 학습은?

**A:**

1. **AI API 통합 경험**
   - OpenAI Whisper, GPT API의 실전 활용
   - 비용 최적화와 성능 밸런싱

2. **YouTube 봇 탐지 우회**
   - 실제 웹 스크래핑의 어려움 체험
   - Anti-Bot 전략 수립 및 구현

3. **Full Stack 개발**
   - FastAPI + Next.js 조합의 장점 깨달음
   - TypeScript로 프론트엔드 안정성 향상

4. **사용자 중심 설계**
   - 에러 메시지의 중요성 (해결 방법 안내)
   - 응답 속도가 UX에 미치는 영향

---

## 📊 기술 스택 요약

### Backend
- **언어**: Python 3.11
- **프레임워크**: FastAPI
- **AI/ML**: OpenAI (Whisper, GPT-4o-mini)
- **도구**: yt-dlp, FFmpeg

### Frontend
- **언어**: TypeScript
- **프레임워크**: Next.js 14 (App Router)
- **스타일**: Tailwind CSS (Munto Design)
- **상태관리**: Zustand
- **HTTP**: Axios

### DevOps
- **버전 관리**: Git, GitHub
- **환경 변수**: python-dotenv
- **패키지 관리**: npm, pip

---

## 🎯 핵심 성과

- ⚡ **처리 속도**: 28초 → 20초 (28% 개선)
- 💰 **비용 효율**: GPT-4o 대비 94% 절감
- 🎯 **사용자 경험**: 명확한 에러 메시지 + 빠른 응답
- 🔒 **보안**: 환경 변수 + .gitignore로 API 키 보호

---

## 💡 면접관에게 강조할 포인트

1. **문제 해결 능력**: YouTube 403 에러, 500 에러 등 실제 문제 해결
2. **성능 최적화**: 오디오 품질, AI 모델 선택으로 28% 속도 향상
3. **비용 의식**: GPT-4o-mini 선택으로 94% 비용 절감
4. **사용자 중심**: 명확한 에러 메시지, 빠른 응답 시간
5. **Full Stack**: Python(FastAPI) + TypeScript(Next.js) 통합 경험

---

**마지막 업데이트**: 2024년 12월 24일  
**프로젝트 저장소**: https://github.com/abclv3/youtube-ai-summarizer
