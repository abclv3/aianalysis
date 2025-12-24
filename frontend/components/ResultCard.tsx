'use client';

import { CheckCircle2, Lightbulb, Volume2 } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';
import { useCreateTts } from '@/hooks/useSummary';
import AudioPlayer from './AudioPlayer';

/**
 * ResultCard 컴포넌트
 * 요약 결과 표시 + TTS 버튼
 */
export default function ResultCard() {
    const { summary, isTtsLoading } = useSummaryStore();
    const { mutate: createTts } = useCreateTts();

    if (!summary) {
        return null;
    }

    const handleGenerateTts = () => {
        createTts({ summary: summary.summary });
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-navy-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">요약 완료</h2>
                            <p className="text-primary-100 text-sm mt-1">
                                GPT-5 nano • {new Date(summary.timestamp).toLocaleString('ko-KR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* 요약 포인트 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="w-6 h-6 text-primary-600" />
                            <h3 className="text-xl font-bold text-navy-900">핵심 요약</h3>
                        </div>

                        {summary.summary.map((point, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-5 bg-navy-50 rounded-xl border border-navy-100
                         hover:border-primary-200 hover:bg-primary-50/50 
                         transition-all duration-200 group"
                            >
                                {/* Number Badge */}
                                <div
                                    className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white 
                           rounded-full flex items-center justify-center font-bold text-lg
                           group-hover:scale-110 transition-transform"
                                >
                                    {index + 1}
                                </div>

                                {/* Point Text */}
                                <p className="flex-1 text-navy-800 leading-relaxed text-lg">
                                    {point}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* TTS 섹션 */}
                    <div className="space-y-4">
                        {!summary.audioUrl ? (
                            /* TTS 생성 버튼 */
                            <button
                                onClick={handleGenerateTts}
                                disabled={isTtsLoading}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 
                         text-white font-semibold text-lg py-6 rounded-2xl
                         hover:from-primary-700 hover:to-primary-800
                         disabled:from-navy-300 disabled:to-navy-400 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5 active:translate-y-0
                         flex items-center justify-center gap-3"
                            >
                                {isTtsLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>TTS 생성 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-6 h-6" />
                                        <span>음성 재생!</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            /* 오디오 플레이어 */
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5 text-primary-600" />
                                    요약 음성 재생
                                </h3>
                                <AudioPlayer audioUrl={summary.audioUrl} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
