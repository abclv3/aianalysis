# 🎬 YouTube AI Summarizer

> **AI 기반 YouTube 비디오 자동 요약 서비스**  
> OpenAI Whisper + GPT-4o-mini로 빠르고 정확한 3줄 요약 제공

[![Made with FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Made with Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)

---

## ✨ 주요 기능

- 🎙️ **음성 인식 (STT)**: OpenAI Whisper API로 YouTube 오디오 → 텍스트 변환
- 🤖 **AI 요약**: GPT-4o-mini로 3줄 핵심 요약 생성
- ⚡ **빠른 처리**: 평균 20초 내 요약 완성 (최적화 완료)
- 📱 **Munto 스타일 UI**: Deep Yellow + Black의 세련된 디자인
- 🔒 **안전한 처리**: 환경 변수 + .gitignore로 API 키 보호

---

## 🚀 Quick Start

### 1. 사전 요구사항

- Node.js 18+
- Python 3.11+
- FFmpeg (오디오 변환용)
- OpenAI API Key

### 2. 설치

```bash
# 레포지토리 클론
git clone https://github.com/abclv3/youtube-ai-summarizer.git
cd youtube-ai-summarizer

# 백엔드 설정
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 환경 변수 설정
copy .env.example .env
# .env 파일에 OPENAI_API_KEY 추가

# 프론트엔드 설정
cd ../frontend
npm install
```

### 3. 실행

```bash
# 백엔드 실행 (터미널 1)
cd backend
python main.py
# → http://localhost:8000

# 프론트엔드 실행 (터미널 2)
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 📊 성능 최적화

| 단계 | 최적화 전 | 최적화 후 | 개선율 |
|------|----------|----------|--------|
| 오디오 다운로드 | 10초 | 8초 | 20% ⬇️ |
| Whisper 업로드 | 5초 | 1초 | 80% ⬇️ |
| GPT 요약 | 3초 | 1초 | 66% ⬇️ |
| **총 처리 시간** | **28초** | **20초** | **28% ⬇️** |

---

## 🛠️ 기술 스택

- **Backend**: FastAPI, OpenAI (Whisper + GPT-4o-mini), yt-dlp
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand

---

## 📝 면접 대비

프로젝트에 대한 상세한 Q&A는 **[INTERVIEW_PREP.md](./INTERVIEW_PREP.md)**을 참고하세요.

---

## 👤 Author

**abclv3** - [GitHub](https://github.com/abclv3)

---

⭐ **이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
