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
        <div className="absolute bottom-[calc(100%+16px)] left-16 z-10 w-48 bg-white dark:bg-[#1f2937] border border-[#e5e5e5] dark:border-[#374151] rounded-md shadow-lg py-2 animate-fade-in">
          <button
            onClick={copyUrl}
            className="w-full flex items-center px-4 py-3 text-[14px] text-[#3a4954] dark:text-[#e2e8f0] hover:bg-[#f8f8f8] dark:hover:bg-[#374151] transition-colors"
          >
            <Link className="w-4 h-4 mr-3 text-[#737373]" />
            URL 복사
          </button>
          {/*<button className="w-full flex items-center px-4 py-3 text-[14px] text-[#3a4954] hover:bg-[#f8f8f8] transition-colors">*/}
          {/*  <MessageCircle className="w-4 h-4 mr-3 text-[#737373]" />*/}
          {/*  카카오톡 공유*/}
          {/*</button>*/}
          {/*<button className="w-full flex items-center px-4 py-3 text-[14px] text-[#3a4954] hover:bg-[#f8f8f8] transition-colors">*/}
          {/*  <Facebook className="w-4 h-4 mr-3 text-[#737373]" />*/}
          {/*  페이스북 공유*/}
          {/*</button>*/}
          {/*<button className="w-full flex items-center px-4 py-3 text-[14px] text-[#3a4954] hover:bg-[#f8f8f8] transition-colors">*/}
          {/*  <Twitter className="w-4 h-4 mr-3 text-[#737373]" />*/}
          {/*  엑스 공유*/}
          {/*</button>*/}
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white dark:bg-[#1f2937] border-r border-b border-[#e5e5e5] dark:border-[#374151] rotate-45" />
        </div>
      )}

      {/* 버튼들 */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 h-10 px-4 border border-[#e5e5e5] dark:border-[#374151] rounded-md bg-white dark:bg-[#1f2937] hover:bg-[#f8f8f8] dark:hover:bg-[#374151] transition-colors text-[14px] text-[#3a4954] dark:text-[#e2e8f0]">
          <Heart className="w-4 h-4 text-[#737373] dark:text-[#94a3b8]" />
          1
        </button>
        <button
          onClick={toggleShare}
          className="flex items-center justify-center w-10 h-10 border border-[#e5e5e5] dark:border-[#374151] rounded-md bg-white dark:bg-[#1f2937] hover:bg-[#f8f8f8] dark:hover:bg-[#374151] transition-colors text-[#737373] dark:text-[#94a3b8]"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-center w-10 h-10 border border-[#e5e5e5] dark:border-[#374151] rounded-md bg-white dark:bg-[#1f2937] hover:bg-[#f8f8f8] dark:hover:bg-[#374151] transition-colors text-[#737373] dark:text-[#94a3b8]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 border border-[#e5e5e5] dark:border-[#374151] rounded-md bg-white dark:bg-[#1f2937] hover:bg-[#f8f8f8] dark:hover:bg-[#374151] transition-colors text-[14px] text-[#3a4954] dark:text-[#e2e8f0]">
          <Bookmark className="w-4 h-4 text-[#3a4954] dark:text-[#e2e8f0] fill-[#3a4954] dark:fill-[#e2e8f0]" />
          구독하기
        </button>
      </div>
    </div>
  );
}
