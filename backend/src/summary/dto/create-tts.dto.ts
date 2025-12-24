import { IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

/**
 * TTS 생성 요청 DTO
 */
export class CreateTtsDto {
    @IsNotEmpty({ message: '요약 텍스트는 필수입니다.' })
    @IsArray({ message: '요약은 배열 형식이어야 합니다.' })
    @ArrayMinSize(1, { message: '최소 1개 이상의 요약 포인트가 필요합니다.' })
    @ArrayMaxSize(5, { message: '최대 5개까지 요약 포인트를 지원합니다.' })
    summary: string[];
}
