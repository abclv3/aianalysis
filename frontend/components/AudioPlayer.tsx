'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
    audioUrl: string;
}

/**
 * AudioPlayer 컴포넌트
 * 커스텀 오디오 플레이어 (Play/Pause, Seek, Volume)
 */
export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    // 오디오 메타데이터 로드
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Play/Pause 토글
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Seek 바 클릭
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // 볼륨 조절
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // 시간 포맷 (MM:SS)
    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl p-6 border border-navy-200">
            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Player Controls */}
            <div className="space-y-4">
                {/* Play/Pause Button */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={togglePlay}
                        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 
                     text-white rounded-full flex items-center justify-center
                     shadow-lg hover:shadow-xl transition-all transform hover:scale-105
                     active:scale-95"
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div
                        onClick={handleSeek}
                        className="relative h-2 bg-navy-200 rounded-full cursor-pointer overflow-hidden
                     hover:h-3 transition-all"
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 
                       rounded-full transition-all"
                            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                        />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-navy-600 font-medium">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-navy-600" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1.5 bg-navy-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-3.5
                     [&::-webkit-slider-thumb]:h-3.5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-primary-600
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-md
                     hover:[&::-webkit-slider-thumb]:bg-primary-700"
                    />
                    <span className="text-xs text-navy-600 font-medium w-8 text-right">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
