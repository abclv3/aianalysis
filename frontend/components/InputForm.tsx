'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';
import { useGetTranscript } from '@/hooks/useSummary';

/**
 * InputForm 컴포넌트
 * YouTube URL 입력 및 자막 추출
 */
export default function InputForm() {
    const [url, setUrl] = useState('');
    const [localError, setLocalError] = useState('');
    const { isLoading, reset } = useSummaryStore();
    const { mutate: getTranscript } = useGetTranscript();

    const validateYoutubeUrl = (url: string): boolean => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return regex.test(url);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!url.trim()) {
            setLocalError('YouTube URL을 입력해주세요.');
            return;
        }

        if (!validateYoutubeUrl(url)) {
            setLocalError('유효한 YouTube URL을 입력해주세요. (예: https://www.youtube.com/watch?v=VIDEO_ID)');
            return;
        }

        // 기존 상태 리셋
        reset();

        // 자막 추출 요청
        getTranscript({ url });
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative">
                {/* Input Field */}
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setLocalError('');
                    }}
                    placeholder="YouTube URL을 입력하세요 (예: https://www.youtube.com/watch?v=...)"
                    disabled={isLoading}
                    className="w-full px-6 py-5 pr-32 text-lg rounded-2xl border-2 border-navy-200
                   bg-white text-navy-900 placeholder-navy-400
                   focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                   disabled:bg-navy-50 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-md"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                   px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700
                   hover:from-primary-700 hover:to-primary-800
                   disabled:from-navy-300 disabled:to-navy-400
                   text-white font-semibold rounded-xl
                   flex items-center gap-2
                   transition-all duration-200 shadow-lg hover:shadow-xl
                   transform hover:-translate-y-0.5 active:translate-y-0
                   disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>처리 중...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>추출</span>
                        </>
                    )}
                </button>
            </form>

            {/* Local Error */}
            {localError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{localError}</p>
                </div>
            )}

            {/* Helper Text */}
            <p className="mt-4 text-sm text-navy-500 text-center">
                자막이 포함된 YouTube 비디오를 입력하세요. AI가 핵심 내용을 요약합니다.
            </p>
        </div>
    );
}
