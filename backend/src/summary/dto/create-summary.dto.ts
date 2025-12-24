import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * YouTube 요약 요청 DTO
 * YouTube URL 형식을 엄격하게 검증
 */
export class CreateSummaryDto {
    @IsNotEmpty({ message: 'YouTube URL은 필수입니다.' })
    @IsString({ message: 'URL은 문자열이어야 합니다.' })
    @Matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/,
        {
            message:
                '유효한 YouTube URL을 입력해주세요. (예: https://www.youtube.com/watch?v=VIDEO_ID)',
        },
    )
    url: string;
}
