'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface ScriptSectionProps {
    script: string;
}

/**
 * ScriptSection - 전체 스크립트 섹션 (접기/펼치기)
 */
export default function ScriptSection({ script }: ScriptSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="bg-white rounded-xl shadow-munto overflow-hidden border border-munto-gray-200">
                {/* Header (Clickable) */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-6 py-4 bg-munto-gray-100 hover:bg-munto-gray-200
                   flex items-center justify-between transition-colors
                   active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-munto-black" />
                        <h3 className="text-lg font-bold text-munto-black">
                            📝 전체 스크립트
                        </h3>
                        <span className="text-sm text-munto-gray-500">
                            ({script.length} 글자)
                        </span>
                    </div>

                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-munto-gray-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-munto-gray-600" />
                    )}
                </button>

                {/* Content (Collapsible) */}
                {isExpanded && (
                    <div className="p-6 max-h-96 overflow-y-auto bg-munto-white border-t border-munto-gray-200">
                        <p className="text-munto-black leading-relaxed whitespace-pre-wrap">
                            {script}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
