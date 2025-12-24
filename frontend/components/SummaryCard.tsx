'use client';

import { Sparkles } from 'lucide-react';

interface SummaryCardProps {
    summary: string[];
}

/**
 * SummaryCard - Munto 스타일 요약 카드
 * 
 * Deep Yellow (#FFC800) 강조 + Black 텍스트 + 그림자 효과
 */
export default function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-munto-lg overflow-hidden border-2 border-munto-yellow">
                {/* Header */}
                <div className="bg-gradient-to-r from-munto-yellow to-yellow-400 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-munto-black rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-munto-yellow" />
                        </div>
                        <h2 className="text-2xl font-bold text-munto-black">
                            ✨ AI 3줄 요약
                        </h2>
                    </div>
                </div>

                {/* Summary Content */}
                <div className="p-6 space-y-4">
                    {summary.map((point, index) => (
                        <div
                            key={index}
                            className="flex gap-4 p-4 bg-munto-white rounded-lg border border-munto-gray-200
                       hover:border-munto-yellow hover:bg-yellow-50
                       transition-all duration-200 group
                       active:scale-95"
                        >
                            {/* Number Badge */}
                            <div
                                className="flex-shrink-0 w-10 h-10 bg-munto-black text-munto-yellow
                         rounded-full flex items-center justify-center font-bold text-lg
                         group-hover:scale-110 transition-transform"
                            >
                                {index + 1}
                            </div>

                            {/* Point Text */}
                            <p className="flex-1 text-munto-black leading-relaxed text-base">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
