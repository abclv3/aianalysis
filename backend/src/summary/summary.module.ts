import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

/**
 * Summary Module
 * Summary 관련 컨트롤러와 서비스를 묶어 관리
 */
@Module({
    controllers: [SummaryController],
    providers: [SummaryService],
})
export class SummaryModule { }
