'use client';

import { Play } from 'lucide-react';

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

/**
 * VideoPlayer - YouTube 플레이어 (Munto 스타일)
 */
export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="bg-white rounded-xl shadow-munto overflow-hidden">
                {/* Header */}
                <div className="bg-munto-black px-6 py-4 flex items-center gap-3">
                    <Play className="w-6 h-6 text-munto-yellow" />
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                        {title}
                    </h3>
                </div>

                {/* YouTube iframe */}
                <div className="relative w-full pb-[56.25%]">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
