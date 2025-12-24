'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';

/**
 * ErrorMessage 컴포넌트
 * 에러 발생 시 사용자 친화적인 메시지 표시
 */
export default function ErrorMessage() {
    const { error, stage, reset } = useSummaryStore();

    if (stage !== 'error' || !error) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-slide-up">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                    {/* Error Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-600" />
                        </div>
                    </div>

                    {/* Error Content */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-red-900 mb-2">
                                처리 중 오류가 발생했습니다
                            </h3>
                            <p className="text-red-700 leading-relaxed">
                                {error}
                            </p>
                        </div>

                        {/* Common Solutions */}
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <p className="text-sm font-semibold text-red-900 mb-2">
                                다음 사항을 확인해주세요:
                            </p>
                            <ul className="space-y-1 text-sm text-red-700">
                                <li>• YouTube URL이 올바른지 확인</li>
                                <li>• 비디오에 자막(한국어)이 포함되어 있는지 확인</li>
                                <li>• 비디오가 공개 또는 일부 공개 상태인지 확인</li>
                                <li>• 백엔드 서버가 실행 중인지 확인</li>
                            </ul>
                        </div>

                        {/* Retry Button */}
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-6 py-3 
                       bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl
                       transition-all shadow-md hover:shadow-lg
                       transform hover:-translate-y-0.5"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span>다시 시도</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
