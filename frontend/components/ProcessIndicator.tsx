'use client';

import { FileText } from 'lucide-react';
import { useSummaryStore } from '@/store/useSummaryStore';

/**
 * ProcessIndicator 컴포넌트
 * 자막 추출 중 표시
 */
export default function ProcessIndicator() {
    const { stage } = useSummaryStore();

    if (stage !== 'extracting') {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-navy-100">
                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-navy-100 rounded-full overflow-hidden mb-8">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-primary-500 to-primary-600">
                        <div className="w-full h-full animate-shimmer" />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8" />
                    </div>

                    <p className="text-lg font-semibold text-primary-700">
                        자막 추출 중...
                    </p>

                    <div className="mt-4 flex gap-2">
                        <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                        <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-75" />
                        <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-150" />
                    </div>
                </div>
            </div>
        </div>
    );
}
