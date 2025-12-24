import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'YouTube AI Summarizer | AI 기반 비디오 요약 & TTS',
    description:
        'YouTube 비디오를 AI로 요약하고 음성으로 변환하는 전문 생산성 도구. OpenAI GPT-4와 TTS 기술로 핵심 내용을 빠르게 파악하세요.',
    keywords: [
        'YouTube 요약',
        'AI 요약',
        'TTS',
        '비디오 요약',
        '생산성 도구',
        'OpenAI',
    ],
    authors: [{ name: 'Senior Full-Stack Developer' }],
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#2563EB',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
