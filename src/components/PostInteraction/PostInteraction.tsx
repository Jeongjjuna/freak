'use client';

import { useState } from 'react';
import { Heart, Upload, MoreHorizontal, Bookmark, Link } from 'lucide-react';

export default function PostInteraction() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const toggleShare = () => setIsShareOpen(!isShareOpen);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL이 복사되었습니다.');
    setIsShareOpen(false);
  };

  return (
    <div className="mt-36 mb-10 relative">
      {/* 공유 팝오버 */}
      {isShareOpen && (
        <div className="absolute bottom-[calc(100%+16px)] left-16 z-10 w-48 bg-[#fff8f9] dark:bg-[#25101a] border border-[#f0d4de] dark:border-[#3d2030] rounded-md shadow-lg py-2 animate-fade-in">
          <button
            onClick={copyUrl}
            className="w-full flex items-center px-4 py-3 text-[14px] text-[#3d2b35] dark:text-[#f5e0ea] hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors"
          >
            <Link className="w-4 h-4 mr-3 text-[#9b7685]" />
            URL 복사
          </button>
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-[#fff8f9] dark:bg-[#25101a] border-r border-b border-[#f0d4de] dark:border-[#3d2030] rotate-45" />
        </div>
      )}

      {/* 버튼들 */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 h-10 px-4 border border-[#f0d4de] dark:border-[#3d2030] rounded-md bg-[#fff8f9] dark:bg-[#25101a] hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors text-[14px] text-[#3d2b35] dark:text-[#f5e0ea]">
          <Heart className="w-4 h-4 text-[#9b7685] dark:text-[#c49ab0]" />
          1
        </button>
        <button
          onClick={toggleShare}
          className="flex items-center justify-center w-10 h-10 border border-[#f0d4de] dark:border-[#3d2030] rounded-md bg-[#fff8f9] dark:bg-[#25101a] hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors text-[#9b7685] dark:text-[#c49ab0]"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-center w-10 h-10 border border-[#f0d4de] dark:border-[#3d2030] rounded-md bg-[#fff8f9] dark:bg-[#25101a] hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors text-[#9b7685] dark:text-[#c49ab0]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 border border-[#f0d4de] dark:border-[#3d2030] rounded-md bg-[#fff8f9] dark:bg-[#25101a] hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors text-[14px] text-[#3d2b35] dark:text-[#f5e0ea]">
          <Bookmark className="w-4 h-4 text-[#3d2b35] dark:text-[#f5e0ea] fill-[#3d2b35] dark:fill-[#f5e0ea]" />
          구독하기
        </button>
      </div>
    </div>
  );
}
