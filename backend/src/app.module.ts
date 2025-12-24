import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SummaryModule } from './summary/summary.module';

@Module({
    imports: [
        // 환경 변수 전역 설정
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SummaryModule,
    ],
})
export class AppModule { }
