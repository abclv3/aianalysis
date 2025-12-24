import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { YoutubeTranscript } from 'youtube-transcript';
import * as fs from 'fs';
import * as path from 'path';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { SummaryResponseDto } from './dto/summary-response.dto';

/**
 * Summary Service (자막 기반)
 * 
 * 플로우:
 * 1. 자막 추출 → 전체 텍스트
 * 2. A. 요약 생성 (GPT-5 nano)
 * 3. B. TTS 생성 (전체 텍스트 또는 요약)
 */
@Injectable()
export class SummaryService {
    private openai: OpenAI;
    private audioStoragePath: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
        }

        this.openai = new OpenAI({ apiKey });

        this.audioStoragePath =
            this.configService.get<string>('AUDIO_STORAGE_PATH') || './public/audio';

        if (!fs.existsSync(this.audioStoragePath)) {
            fs.mkdirSync(this.audioStoragePath, { recursive: true });
        }

        console.log('✅ SummaryService 초기화 완료 (자막 기반 모드)');
    }

    /**
     * YouTube URL에서 비디오 ID 추출
     */
    private extractVideoId(url: string): string {
        const regex =
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);

        if (!match || !match[1]) {
            throw new BadRequestException('유효한 YouTube 비디오 ID를 찾을 수 없습니다.');
        }

        return match[1];
    }

    /**
     * YouTube 자막 추출 (전체 텍스트)
     */
    async extractFullTranscript(url: string): Promise<{ videoId: string; transcript: string }> {
        try {
            const videoId = this.extractVideoId(url);
            console.log(`📝 자막 추출 시작... (비디오 ID: ${videoId})`);

            let transcriptData;

            // 1. 한국어 자막 시도
            try {
                transcriptData = await YoutubeTranscript.fetchTranscript(videoId, {
                    lang: 'ko'
                });
                console.log('✅ 한국어 자막 발견!');
            } catch (koError) {
                console.log('❌ 한국어 자막 없음, 영어 시도...');

                // 2. 영어 자막 시도
                try {
                    transcriptData = await YoutubeTranscript.fetchTranscript(videoId, {
                        lang: 'en'
                    });
                    console.log('✅ 영어 자막 발견!');
                } catch (enError) {
                    console.log('❌ 영어 자막 없음, 기본 자막 시도...');

                    // 3. 기본 자막 시도
                    transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
                    console.log('✅ 기본 자막 발견!');
                }
            }

            if (!transcriptData || transcriptData.length === 0) {
                throw new BadRequestException(
                    '이 비디오에는 사용 가능한 자막이 없습니다. 자막이 활성화된 비디오를 선택해주세요.'
                );
            }

            const fullText = transcriptData.map((item) => item.text).join(' ');
            console.log(`✅ 자막 추출 완료! (${fullText.length} 글자) ⚡`);

            return {
                videoId,
                transcript: fullText,
            };
        } catch (error) {
            console.error('❌ 자막 추출 실패:', error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error.message?.includes('Video unavailable') || error.message?.includes('not found')) {
                throw new BadRequestException(
                    '비디오를 찾을 수 없습니다. URL이 올바른지 확인하거나 비디오가 공개 상태인지 확인해주세요.'
                );
            }

            if (error.message?.includes('disabled') || error.message?.includes('Transcript')) {
                throw new BadRequestException(
                    '이 비디오는 자막이 비활성화되어 있습니다. 자막이 있는 다른 비디오를 선택해주세요.'
                );
            }

            throw new InternalServerErrorException(
                `자막 추출 중 오류가 발생했습니다: ${error.message}`
            );
        }
    }

    /**
     * GPT-5 nano를 사용하여 요약
     */
    async summarizeText(text: string): Promise<string[]> {
        try {
            console.log('🤖 GPT-5 nano 요약 시작...');

            const systemPrompt = `당신은 전문적인 콘텐츠 요약 전문가입니다.`;

            const userPrompt = `다음 YouTube 비디오 자막 텍스트를 읽고, 가장 중요한 3개에서 5개의 핵심 포인트로 요약해주세요.

요구사항:
- 각 포인트는 명확하고 간결하게 (1-2문장)
- 구체적인 정보와 인사이트를 포함
- 전문적이고 임팩트 있는 표현 사용
- 한국어로 작성

텍스트:
${text}

응답 형식 (JSON):
{"summary": ["첫 번째 핵심 포인트", "두 번째 핵심 포인트", "세 번째 핵심 포인트"]}`;

            const model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview';

            const response = await this.openai.chat.completions.create({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new InternalServerErrorException('요약 생성 실패');
            }

            const parsed = JSON.parse(content);

            let summaryArray: string[];
            if (Array.isArray(parsed)) {
                summaryArray = parsed;
            } else if (parsed.summary && Array.isArray(parsed.summary)) {
                summaryArray = parsed.summary;
            } else if (parsed.points && Array.isArray(parsed.points)) {
                summaryArray = parsed.points;
            } else {
                summaryArray = Object.values(parsed).filter(
                    (item) => typeof item === 'string',
                );
            }

            if (summaryArray.length > 5) {
                summaryArray = summaryArray.slice(0, 5);
            }

            console.log(`✅ 요약 완료! (${summaryArray.length}개 포인트)`);
            return summaryArray;
        } catch (error) {
            console.error('❌ GPT 요약 오류:', error);
            throw new InternalServerErrorException(
                `AI 요약 생성 중 오류가 발생했습니다: ${error.message}`
            );
        }
    }

    /**
     * TTS 오디오 생성
     */
    async generateTTS(text: string): Promise<string> {
        try {
            console.log('🔊 TTS 오디오 생성 시작...');
            console.log(`📊 텍스트 길이: ${text.length} 글자`);

            // OpenAI TTS는 4096자 제한
            if (text.length > 4000) {
                console.warn('⚠️ 텍스트가 너무 깁니다. 앞부분 4000자만 사용합니다.');
                text = text.substring(0, 4000) + '...';
            }

            const mp3Response = await this.openai.audio.speech.create({
                model: 'tts-1',
                voice: 'alloy',
                input: text,
                speed: 1.0,
            });

            const fileName = `tts_${Date.now()}.mp3`;
            const filePath = path.join(this.audioStoragePath, fileName);

            const buffer = Buffer.from(await mp3Response.arrayBuffer());
            fs.writeFileSync(filePath, buffer);

            console.log(`✅ TTS 생성 완료: ${fileName}`);
            return `/audio/${fileName}`;
        } catch (error) {
            console.error('❌ TTS 생성 오류:', error);
            throw new InternalServerErrorException(
                `TTS 오디오 생성 중 오류가 발생했습니다: ${error.message}`
            );
        }
    }

    /**
     * 메인 처리: 자막 → 요약
     */
    async createSummary(
        createSummaryDto: CreateSummaryDto,
    ): Promise<SummaryResponseDto> {
        const { url } = createSummaryDto;

        try {
            console.log('\n========================================');
            console.log('🎬 YouTube AI 요약 시작');
            console.log('========================================');

            // 1. 자막 추출
            const { transcript } = await this.extractFullTranscript(url);

            // 2. 요약 생성
            const summaryArray = await this.summarizeText(transcript);

            console.log('========================================');
            console.log('✅ 요약 생성 완료!');
            console.log('========================================\n');

            return {
                summary: summaryArray,
                videoTitle: undefined,
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.log('========================================');
            console.error('❌ 오류 발생:', error.message);
            console.log('========================================\n');
            throw error;
        }
    }

    /**
     * TTS 생성 (요약 텍스트용)
     */
    async createTts(summaryArray: string[]): Promise<string> {
        const summaryText = summaryArray
            .map((point, index) => `${index + 1}. ${point}`)
            .join('\n\n');

        return await this.generateTTS(summaryText);
    }

    /**
     * TTS 생성 (전체 텍스트용)
     */
    async createFullTextTts(text: string): Promise<string> {
        return await this.generateTTS(text);
    }
}
