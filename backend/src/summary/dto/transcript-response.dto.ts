/**
 * 전체 텍스트 응답 DTO
 */
export class TranscriptResponseDto {
    /**
     * 비디오 ID
     */
    videoId: string;

    /**
     * 전체 자막 텍스트
     */
    transcript: string;

    /**
     * 추출 시간
     */
    timestamp: string;
}

/**
 * 전체 텍스트 TTS 요청 DTO
 */
export class CreateFullTextTtsDto {
    /**
     * 전체 텍스트
     */
    text: string;
}
