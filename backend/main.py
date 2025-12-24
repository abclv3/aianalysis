"""
YouTube AI 요약 서비스 - FastAPI Backend
Anti-Bot Strategy: yt-dlp + cookies.txt
"""

import os
import re
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv
import yt_dlp
from openai import OpenAI

# 환경 변수 로드
load_dotenv()

# FastAPI 앱 초기화
app = FastAPI(title="YouTube AI Summarizer (Munto Style)")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI 클라이언트
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 경로 설정
BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"
COOKIES_PATH = BASE_DIR / "cookies.txt"
TEMP_DIR.mkdir(exist_ok=True)


# ==================== Pydantic Models ====================

class SummarizeRequest(BaseModel):
    """요약 요청 모델"""
    url: HttpUrl


class SummarizeResponse(BaseModel):
    """요약 응답 모델"""
    video_id: str
    video_title: str
    summary: list[str]  # 3줄 요약
    full_script: str    # 전체 스크립트
    timestamp: str


# ==================== Helper Functions ====================

def extract_video_id(url: str) -> str:
    """YouTube URL에서 비디오 ID 추출"""
    pattern = r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    if not match:
        raise HTTPException(status_code=400, detail="유효한 YouTube URL이 아닙니다.")
    return match.group(1)


async def download_audio(video_id: str) -> tuple[str, str]:
    """
    yt-dlp를 사용하여 오디오 다운로드
    🔥 Anti-Bot: cookies.txt + User-Agent + 완벽한 에러 처리
    """
    output_path = str(TEMP_DIR / f"{video_id}.mp3")
    
    # 이미 다운로드된 파일이 있으면 재사용
    if os.path.exists(output_path):
        print(f"✅ 캐시된 오디오 파일 사용: {output_path}")
        
        # 비디오 제목만 가져오기 (다운로드 안 함)
        try:
            with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True}) as ydl:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
                
                # 🔥 NoneType 체크
                if info is None:
                    return output_path, "Unknown Title"
                    
                return output_path, info.get('title', 'Unknown Title')
        except:
            # 제목을 못 가져와도 캐시된 파일은 사용
            return output_path, "Unknown Title"
    
    # 🔥 STEP 1: Cookie 파일 존재 여부 확인
    cookies_exists = os.path.exists(COOKIES_PATH)
    
    if cookies_exists:
        print(f"✅ cookies.txt 파일 발견: {COOKIES_PATH}")
    else:
        print(f"⚠️ cookies.txt 파일이 없습니다. 일반 모드로 시도합니다.")
        print(f"   (403 에러 발생 시 cookies.txt를 추가하세요)")
    
    # 🔥 STEP 2: yt-dlp 옵션 설정 (강화된 Anti-Bot + 속도 최적화)
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': str(TEMP_DIR / f"{video_id}.%(ext)s"),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '32',  # 🔥 최적화: 192 -> 32 (파일 크기 85% 감소)
        }],
        
        # 🔥 Anti-Bot #1: Cookie 파일 (있을 때만)
        'cookiefile': str(COOKIES_PATH) if cookies_exists else None,
        
        # 🔥 Anti-Bot #2: HTTP Headers (User-Agent 변조)
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.youtube.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
        },
        
        # 🔥 Anti-Bot #3: 기타 우회 옵션
        'nocheckcertificate': True,
        'ignoreerrors': False,  # 에러를 제대로 캐치하기 위해 False로 변경
        'no_warnings': True,
        'quiet': False,
        'geo_bypass': True,
        'age_limit': None,
    }
    
    try:
        print(f"🎵 YouTube 오디오 다운로드 시작: {video_id}")
        print(f"📍 URL: https://www.youtube.com/watch?v={video_id}")
        
        # 🔥 STEP 3: yt-dlp 실행
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=True)
            
            # 🔥 NoneType 체크 (중요!)
            if info is None:
                print("❌ 비디오 정보를 가져올 수 없습니다 (info=None)")
                raise HTTPException(
                    status_code=400,
                    detail="유튜브 영상 정보를 가져올 수 없습니다. cookies.txt 파일을 확인하거나 다른 비디오를 시도하세요."
                )
            
            # 비디오 제목 추출
            video_title = info.get('title', 'Unknown Title')
            
            # 파일이 실제로 생성되었는지 확인
            if not os.path.exists(output_path):
                print(f"❌ 오디오 파일이 생성되지 않았습니다: {output_path}")
                raise HTTPException(
                    status_code=500,
                    detail="오디오 파일 생성 실패. FFmpeg가 설치되어 있는지 확인하세요."
                )
        
        print(f"✅ 오디오 다운로드 완료!")
        print(f"   제목: {video_title}")
        print(f"   파일: {output_path}")
        
        return output_path, video_title
        
    except HTTPException:
        # 이미 HTTPException이면 그대로 전달
        raise
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ 오디오 다운로드 실패: {error_msg}")
        
        # 에러 메시지 분석
        if "403" in error_msg or "Forbidden" in error_msg or "HTTP Error 403" in error_msg:
            raise HTTPException(
                status_code=403,
                detail="YouTube 접근이 차단되었습니다 (403 Forbidden). cookies.txt 파일을 추가하거나 업데이트하세요."
            )
        elif "Video unavailable" in error_msg or "Private video" in error_msg or "not available" in error_msg:
            raise HTTPException(
                status_code=404,
                detail="비디오를 찾을 수 없거나 비공개/삭제되었습니다."
            )
        elif "Sign in" in error_msg or "This video requires" in error_msg:
            raise HTTPException(
                status_code=401,
                detail="이 비디오는 로그인이 필요합니다. cookies.txt 파일을 추가하세요."
            )
        elif "FFmpeg" in error_msg or "ffmpeg" in error_msg:
            raise HTTPException(
                status_code=500,
                detail="FFmpeg가 설치되지 않았습니다. FFmpeg를 설치한 후 다시 시도하세요."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"오디오 다운로드 실패: {error_msg}"
            )


async def transcribe_audio(audio_path: str) -> str:
    """OpenAI Whisper API로 음성 → 텍스트 변환"""
    try:
        print(f"🎙️ Whisper STT 시작: {audio_path}")
        
        # 파일 크기 확인 (25MB 제한)
        file_size_mb = os.path.getsize(audio_path) / (1024 * 1024)
        print(f"📊 오디오 파일 크기: {file_size_mb:.2f} MB")
        
        if file_size_mb > 25:
            raise HTTPException(
                status_code=400,
                detail="오디오 파일이 너무 큽니다 (25MB 초과). 더 짧은 비디오를 선택하세요."
            )
        
        # Whisper API 호출
        with open(audio_path, "rb") as audio_file:
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="ko",  # 한국어 최적화
                response_format="text"
            )
        
        print(f"✅ STT 완료: {len(transcript)} 글자")
        return transcript
        
    except Exception as e:
        print(f"❌ STT 실패: {e}")
        raise HTTPException(status_code=500, detail=f"음성 인식 실패: {str(e)}")


async def summarize_text(text: str) -> list[str]:
    """GPT-4o-mini로 3줄 요약 생성 (🔥 최적화: 빠르고 저렴함)"""
    try:
        print(f"🤖 GPT-4o-mini 요약 시작... (최적화 모델)")
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # 🔥 최적화: gpt-4o -> gpt-4o-mini (2-3배 빠름, 90% 저렴)
            messages=[
                {
                    "role": "system",
                    "content": "당신은 전문 콘텐츠 요약 전문가입니다. YouTube 비디오 스크립트를 정확하고 간결하게 3줄로 요약합니다."
                },
                {
                    "role": "user",
                    "content": f"""다음 YouTube 비디오 스크립트를 읽고, 가장 중요한 핵심 내용을 **정확히 3줄**로 요약해주세요.

요구사항:
- 각 줄은 1-2문장으로 명확하고 간결하게
- 구체적인 정보와 핵심 인사이트 포함
- 한국어로 작성
- JSON 배열 형식으로 반환

스크립트:
{text[:4000]}

응답 형식 (JSON):
{{"summary": ["첫 번째 핵심", "두 번째 핵심", "세 번째 핵심"]}}"""
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        summary_list = result.get("summary", [])
        
        # 정확히 3개로 조정
        if len(summary_list) > 3:
            summary_list = summary_list[:3]
        elif len(summary_list) < 3:
            # 3개 미만이면 에러
            raise ValueError("요약이 3개 미만입니다.")
        
        print(f"✅ 요약 완료: {summary_list}")
        return summary_list
        
    except Exception as e:
        print(f"❌ 요약 실패: {e}")
        raise HTTPException(status_code=500, detail=f"AI 요약 생성 실패: {str(e)}")


# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "status": "ok",
        "message": "YouTube AI Summarizer API (Munto Style)",
        "cookies_loaded": COOKIES_PATH.exists()
    }


@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_video(request: SummarizeRequest):
    """
    YouTube 비디오 요약
    
    플로우:
    1. yt-dlp + cookies로 오디오 다운로드
    2. Whisper API로 STT
    3. GPT-4o로 3줄 요약
    """
    from datetime import datetime
    
    try:
        print("\n========================================")
        print("🎬 YouTube AI 요약 시작")
        print("========================================")
        
        # 1. 비디오 ID 추출
        video_id = extract_video_id(str(request.url))
        print(f"📹 비디오 ID: {video_id}")
        
        # 2. 오디오 다운로드 (yt-dlp + cookies)
        audio_path, video_title = await download_audio(video_id)
        
        # 3. STT (Whisper API)
        full_script = await transcribe_audio(audio_path)
        
        # 4. 요약 (GPT-4o)
        summary = await summarize_text(full_script)
        
        print("========================================")
        print("✅ 요약 생성 완료!")
        print("========================================\n")
        
        return SummarizeResponse(
            video_id=video_id,
            video_title=video_title,
            summary=summary,
            full_script=full_script,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"========================================")
        print(f"❌ 오류 발생: {str(e)}")
        print("========================================\n")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== 서버 실행 ====================

if __name__ == "__main__":
    import uvicorn
    # reload 모드는 문자열 import 방식으로 실행
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
