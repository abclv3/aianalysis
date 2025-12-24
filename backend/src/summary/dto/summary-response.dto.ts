/**
 * YouTube 요약 응답 DTO (텍스트만)
 */
export class SummaryResponseDto {
    /**
     * 요약된 핵심 포인트 (3-5개)
     */
    summary: string[];

    /**
     * 원본 비디오 제목 (선택적)
     */
    videoTitle?: string;

    /**
     * 요약 생성 시간
     */
    timestamp: string;
}

/**
 * TTS 생성 응답 DTO
 */
export class TtsResponseDto {
    /**
     * 생성된 TTS 오디오 파일 URL
     */
    audioUrl: string;

    /**
     * TTS 생성 시간
     */
    timestamp: string;
}
