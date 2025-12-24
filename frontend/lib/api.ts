import axios from 'axios';

/**
 * FastAPI 기본 URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Axios 인스턴스
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 180000, // 3분 (오디오 다운로드 + STT + 요약)
});

/**
 * 요약 요청/응답 타입
 */
export interface SummarizeRequest {
    url: string;
}

export interface SummarizeResponse {
    video_id: string;
    video_title: string;
    summary: string[];        // 3줄 요약
    full_script: string;      // 전체 스크립트
    timestamp: string;
}

/**
 * API 함수
 */
export const youtubeApi = {
    /**
     * POST /api/summarize - YouTube 비디오 요약
     */
    summarize: async (data: SummarizeRequest): Promise<SummarizeResponse> => {
        const response = await apiClient.post<SummarizeResponse>('/api/summarize', data);
        return response.data;
    },
};
