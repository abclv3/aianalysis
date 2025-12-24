'use client';

import { FileText, Sparkles, Volume2 } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';
import { useCreateSummary, useCreateFullTextTts } from '@/hooks/useSummary';
import AudioPlayer from './AudioPlayer';

/**
 * TranscriptView 컴포넌트
 * 전체 자막 텍스트 표시 + A. 요약해줘! / B. 음성 재생! 버튼
 */
export default function TranscriptView() {
    const { transcript, fullTextAudioUrl, isSummarizing, isFullTextTtsLoading } = useSummaryStore();
    const { mutate: createSummary } = useCreateSummary();
    const { mutate: createFullTextTts } = useCreateFullTextTts();

    if (!transcript) {
        return null;
    }

    const handleSummarize = () => {
        createSummary({ url: `https://www.youtube.com/watch?v=${transcript.videoId}` });
    };

    const handlePlayFullText = () => {
        createFullTextTts({ text: transcript.transcript });
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-navy-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-navy-600 to-navy-700 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-white" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">전체 자막 텍스트</h2>
                            <p className="text-navy-100 text-sm mt-1">
                                비디오 ID: {transcript.videoId} • {transcript.transcript.length} 글자
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* 전체 텍스트 */}
                    <div className="max-h-96 overflow-y-auto p-6 bg-navy-50 rounded-xl border border-navy-200">
                        <p className="text-navy-800 leading-relaxed whitespace-pre-wrap">
                            {transcript.transcript}
                        </p>
                    </div>

                    {/* A/B 버튼 */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* A. 요약해줘! */}
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className="flex items-center justify-center gap-3 py-6 px-6
                       bg-gradient-to-r from-primary-600 to-primary-700
                       hover:from-primary-700 hover:to-primary-800
                       disabled:from-navy-300 disabled:to-navy-400
                       text-white font-bold text-lg rounded-2xl
                       shadow-lg hover:shadow-xl
                       transform hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-200
                       disabled:cursor-not-allowed"
                        >
                            {isSummarizing ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>요약 생성 중...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    <span>A. 요약해줘!</span>
                                </>
                            )}
                        </button>

                        {/* B. 음성 재생! */}
                        <button
                            onClick={handlePlayFullText}
                            disabled={isFullTextTtsLoading || !!fullTextAudioUrl}
                            className="flex items-center justify-center gap-3 py-6 px-6
                       bg-gradient-to-r from-green-600 to-green-700
                       hover:from-green-700 hover:to-green-800
                       disabled:from-navy-300 disabled:to-navy-400
                       text-white font-bold text-lg rounded-2xl
                       shadow-lg hover:shadow-xl
                       transform hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-200
                       disabled:cursor-not-allowed"
                        >
                            {isFullTextTtsLoading ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>음성 생성 중...</span>
                                </>
                            ) : fullTextAudioUrl ? (
                                <>
                                    <Volume2 className="w-6 h-6" />
                                    <span>재생 중 ↓</span>
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-6 h-6" />
                                    <span>B. 음성 재생!</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* 전체 텍스트 오디오 플레이어 */}
                    {fullTextAudioUrl && (
                        <div className="space-y-4 animate-slide-up">
                            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-green-600" />
                                전체 텍스트 음성 재생
                            </h3>
                            <AudioPlayer audioUrl={fullTextAudioUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
