'use client';

import { useState } from 'react';
import { Send, Youtube, Loader2 } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';
import { youtubeApi } from '@/lib/api';
import SummaryCard from '@/components/SummaryCard';
import VideoPlayer from '@/components/VideoPlayer';
import ScriptSection from '@/components/ScriptSection';

export default function Home() {
    const [url, setUrl] = useState('');
    const { result, error, isLoading, setResult, setError, setLoading, reset } = useSummaryStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            setError('YouTube URL을 입력해주세요.');
            return;
        }

        reset();
        setLoading(true);

        try {
            const data = await youtubeApi.summarize({ url });
            setResult({
                videoId: data.video_id,
                videoTitle: data.video_title,
                summary: data.summary,
                fullScript: data.full_script,
                timestamp: data.timestamp,
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || '요약 생성 중 오류가 발생했습니다.';
            setError(errorMessage);
        }
    };

    return (
        <main className="min-h-screen bg-munto-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-munto-yellow rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-munto-lg">
                        <Youtube className="w-10 h-10 text-munto-black fill-munto-black" />
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-munto-black mb-4">
                        YouTube AI 요약
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-munto-gray-600">
                        긴 YouTube 비디오를 AI가 3줄로 요약해드립니다
                    </p>

                    {/* Badge */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-munto-black rounded-full">
                        <div className="w-2 h-2 bg-munto-yellow rounded-full animate-pulse-slow" />
                        <span className="text-sm font-medium text-white">
                            GPT-4o-mini + Whisper 기반
                        </span>
                    </div>
                </div>

                {/* Input Form */}
                <div className="w-full max-w-3xl mx-auto mb-8">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="YouTube URL을 입력하세요..."
                            disabled={isLoading}
                            className="w-full px-6 py-5 pr-32 text-lg rounded-2xl border-2 border-munto-gray-300
                       bg-white text-munto-black placeholder-munto-gray-400
                       focus:outline-none focus:border-munto-yellow focus:ring-4 focus:ring-yellow-100
                       disabled:bg-munto-gray-100 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-munto"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2
                       px-6 py-3 bg-munto-yellow hover:bg-yellow-500
                       disabled:bg-munto-gray-300
                       text-munto-black font-bold rounded-xl
                       flex items-center gap-2
                       transition-all duration-200 shadow-md hover:shadow-lg
                       transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                       disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>처리 중...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>요약</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Helper Text */}
                    <p className="mt-4 text-sm text-munto-gray-500 text-center">
                        💡 음성이 포함된 YouTube 비디오 URL을 입력하세요
                    </p>
                </div>

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="w-full max-w-4xl mx-auto my-8 space-y-6 animate-pulse">
                        <div className="bg-munto-gray-200 h-64 rounded-xl" />
                        <div className="bg-munto-gray-200 h-48 rounded-xl" />
                        <div className="bg-munto-gray-200 h-32 rounded-xl" />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="w-full max-w-4xl mx-auto my-8">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-red-900 mb-2">
                                ⚠️ 오류가 발생했습니다
                            </h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={reset}
                                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg
                         transition-colors active:scale-95"
                            >
                                다시 시도
                            </button>
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && !isLoading && (
                    <div className="animate-slide-up space-y-6">
                        {/* Video Player */}
                        <VideoPlayer videoId={result.videoId} title={result.videoTitle} />

                        {/* Summary Card */}
                        <SummaryCard summary={result.summary} />

                        {/* Script Section */}
                        <ScriptSection script={result.fullScript} />
                    </div>
                )}

                {/* Footer */}
                <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-munto-gray-200 text-center">
                    <p className="text-sm text-munto-gray-500">
                        Powered by{' '}
                        <span className="font-semibold text-munto-yellow">
                            FastAPI + yt-dlp + OpenAI
                        </span>
                    </p>
                </footer>
            </div>
        </main>
    );
}
