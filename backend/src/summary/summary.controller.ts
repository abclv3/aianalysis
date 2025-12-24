import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { CreateTtsDto } from './dto/create-tts.dto';
import { SummaryResponseDto, TtsResponseDto } from './dto/summary-response.dto';
import { TranscriptResponseDto, CreateFullTextTtsDto } from './dto/transcript-response.dto';

/**
 * Summary Controller
 * 
 * 엔드포인트:
 * - POST /api/summary/transcript - 전체 자막 텍스트 추출
 * - POST /api/summary - 요약 생성
 * - POST /api/summary/tts - 요약 TTS 생성
 * - POST /api/summary/tts-full - 전체 텍스트 TTS 생성
 */
@Controller('summary')
export class SummaryController {
    constructor(private readonly summaryService: SummaryService) { }

    /**
     * 전체 자막 텍스트 추출
     * 
     * @param createSummaryDto - YouTube URL
     * @returns 전체 텍스트
     */
    @Post('transcript')
    @HttpCode(HttpStatus.OK)
    async getTranscript(
        @Body() createSummaryDto: CreateSummaryDto,
    ): Promise<TranscriptResponseDto> {
        const { videoId, transcript } = await this.summaryService.extractFullTranscript(
            createSummaryDto.url,
        );

        return {
            videoId,
            transcript,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * YouTube 비디오 요약 생성
     * 
     * @param createSummaryDto - YouTube URL
     * @returns 요약 텍스트
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    async createSummary(
        @Body() createSummaryDto: CreateSummaryDto,
    ): Promise<SummaryResponseDto> {
        return await this.summaryService.createSummary(createSummaryDto);
    }

    /**
     * 요약 TTS 생성
     * 
     * @param createTtsDto - 요약 텍스트 배열
     * @returns 오디오 URL
     */
    @Post('tts')
    @HttpCode(HttpStatus.OK)
    async createTts(
        @Body() createTtsDto: CreateTtsDto,
    ): Promise<TtsResponseDto> {
        const audioUrl = await this.summaryService.createTts(createTtsDto.summary);
        return {
            audioUrl,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * 전체 텍스트 TTS 생성
     * 
     * @param createFullTextTtsDto - 전체 텍스트
     * @returns 오디오 URL
     */
    @Post('tts-full')
    @HttpCode(HttpStatus.OK) async createFullTextTts(
        @Body() createFullTextTtsDto: CreateFullTextTtsDto,
    ): Promise<TtsResponseDto> {
        const audioUrl = await this.summaryService.createFullTextTts(createFullTextTtsDto.text);
        return {
            audioUrl,
            timestamp: new Date().toISOString(),
        };
    }
}
