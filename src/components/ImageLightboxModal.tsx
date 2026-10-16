import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info
} from 'lucide-react';
import { TopicItem } from '../types';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicItem;
  allTopics: TopicItem[];
  onSelectTopic: (topicId: string) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  topic,
  allTopics,
  onSelectTopic,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan whenever the active topic changes or modal opens
  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetTransform();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, topic.id, resetTransform]);

  // Current topic index in the list
  const currentIndex = allTopics.findIndex((t) => t.id === topic.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allTopics.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      onSelectTopic(allTopics[currentIndex - 1].id);
      resetTransform();
    }
  }, [hasPrev, currentIndex, allTopics, onSelectTopic, resetTransform]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      onSelectTopic(allTopics[currentIndex + 1].id);
      resetTransform();
    }
  }, [hasNext, currentIndex, allTopics, onSelectTopic, resetTransform]);

  // Zoom controls
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.35, 4));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const nextScale = Math.max(prev - 0.35, 1);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  // Double click toggles between 1x and 2x zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetTransform();
    } else {
      setScale(2);
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomStep = 0.2;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + zoomStep, 4));
    } else {
      setScale((prev) => {
        const nextScale = Math.max(prev - zoomStep, 1);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return nextScale;
      });
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setScale((prev) => Math.min(prev + 0.35, 4));
      } else if (e.key === '-') {
        setScale((prev) => {
          const next = Math.max(prev - 0.35, 1);
          if (next === 1) setPosition({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        resetTransform();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, resetTransform]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-md select-none transition-opacity duration-300 animate-fadeIn"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/50 border-b border-white/10 z-20">
        <div className="flex items-center gap-3 text-white min-w-0">
          <span className="px-2.5 py-0.5 rounded-lg bg-[#D9A441] text-[#21354D] text-xs font-bold whitespace-nowrap shadow-sm">
            Chủ đề {topic.number} / {allTopics.length}
          </span>
          <h3 className="text-sm sm:text-base font-bold font-heritage truncate text-amber-100">
            {topic.title}
          </h3>
        </div>

        {/* Toolbar & Close Button */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/15">
            <button
              onClick={zoomOut}
              disabled={scale <= 1}
              title="Thu nhỏ (-)"
              className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-mono font-bold text-amber-300 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={zoomIn}
              disabled={scale >= 4}
              title="Phóng to (+)"
              className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 rounded-lg transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <button
              onClick={resetTransform}
              title="Khôi phục kích thước ban đầu (Phím 0)"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            title="Đóng (Phím Esc)"
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition border border-red-400/30 shadow-sm ml-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewer Stage */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className={`relative flex-1 flex items-center justify-center overflow-hidden p-4 ${
          scale > 1
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-zoom-in'
        }`}
      >
        <img
          src={topic.imageUrl}
          alt={topic.title}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
            maxWidth: '90vw',
            maxHeight: '75vh',
          }}
          className="object-contain rounded-2xl shadow-2xl select-none pointer-events-auto border-2 border-amber-400/30"
        />

        {/* Previous Topic Button */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Xem ảnh chủ đề trước (Mũi tên trái)"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#B93632] text-white border border-white/20 shadow-xl transition backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Topic Button */}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Xem ảnh chủ đề tiếp theo (Mũi tên phải)"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#B93632] text-white border border-white/20 shadow-xl transition backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption & Student Guide Footer */}
      <div className="px-4 sm:px-8 py-3.5 bg-black/70 border-t border-white/10 backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
              <span>{topic.imageCaption}</span>
            </p>
            <p className="text-xs text-gray-400">
              {topic.period} • Lăng mộ và Đền thờ Thái sư Cương Quốc công Nguyễn Xí
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap">
            <Info className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>Lăn chuột hoặc chạm 2 lần để phóng to • Kéo để di chuyển • Nhấn Esc để đóng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
