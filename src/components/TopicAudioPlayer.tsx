import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  Headphones,
  Sparkles
} from 'lucide-react';

interface Props {
  audioUrl?: string;
  topicTitle: string;
  topicNumber: number;
}

export const TopicAudioPlayer: React.FC<Props> = ({ audioUrl, topicTitle, topicNumber }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // When audioUrl changes (user selects a different topic)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  // Sync volume & rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Không thể phát âm thanh tự động:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    setVolume(nextVol);
    if (nextVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 0.9];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-[#FFF6E5] via-amber-50 to-[#FFF6E5] rounded-2xl border-2 border-[#D9A441] shadow-md p-4 transition-all">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#B93632] text-amber-200 flex items-center justify-center shadow-sm">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#B93632]">
                Thuyết Minh Giọng Đọc
              </span>
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#21354D] line-clamp-1">
              Chủ đề {topicNumber}: {topicTitle}
            </h4>
          </div>
        </div>

        {/* Audio Wave animation when playing */}
        {isPlaying && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#307A67]/10 rounded-full border border-[#307A67]/30">
            <span className="w-1 h-3 bg-[#307A67] rounded-full animate-bounce"></span>
            <span className="w-1 h-4 bg-[#307A67] rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1 h-2 bg-[#307A67] rounded-full animate-bounce [animation-delay:0.3s]"></span>
            <span className="w-1 h-4 bg-[#307A67] rounded-full animate-bounce [animation-delay:0.45s]"></span>
            <span className="text-[11px] font-bold text-[#307A67] ml-1">Đang đọc</span>
          </div>
        )}
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center gap-3">
        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B93632] to-[#8B1A17] hover:from-[#9D2824] hover:to-[#741310] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform active:scale-95 border border-[#D9A441] flex-shrink-0 cursor-pointer"
          title={isPlaying ? 'Tạm dừng' : 'Tiếp tục / Bắt đầu nghe'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Replay Button */}
        <button
          type="button"
          onClick={handleRestart}
          className="w-9 h-9 rounded-xl bg-white hover:bg-amber-100/60 text-[#21354D] border border-[#D9A441]/60 flex items-center justify-center transition cursor-pointer flex-shrink-0"
          title="Nghe lại từ đầu"
        >
          <RotateCcw className="w-4 h-4 text-[#B93632]" />
        </button>

        {/* Progress Bar & Seek Slider */}
        <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-amber-200/80 rounded-lg appearance-none cursor-pointer accent-[#B93632]"
              style={{
                background: `linear-gradient(to right, #B93632 ${progressPercent}%, #E2D3B8 ${progressPercent}%)`
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 font-medium px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Speed Button */}
        <button
          type="button"
          onClick={cycleSpeed}
          className="px-2 py-1 text-xs font-bold text-[#21354D] bg-white border border-[#D9A441]/60 rounded-lg hover:bg-amber-100/60 transition cursor-pointer flex-shrink-0"
          title="Tốc độ đọc"
        >
          {playbackRate}x
        </button>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 pl-1 border-l border-[#D9A441]/40">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 text-[#21354D] hover:text-[#B93632] transition cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4 text-[#307A67]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#307A67]" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-amber-200/80 rounded-lg appearance-none cursor-pointer accent-[#307A67]"
            title={`Âm lượng: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
