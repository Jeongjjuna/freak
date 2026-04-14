import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-290 mx-auto px-6">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-[80px] font-bold text-[var(--c-border)] leading-none">404</p>
        <p className="text-[18px] text-[var(--c-text)] mt-4 mb-2">페이지를 찾을 수 없어요</p>
        <p className="text-[14px] text-[var(--c-muted)] mb-8">
          흠, 여기는 아무것도 없군요.
        </p>
        <Link
          href="/"
          className="text-[14px] text-[var(--c-muted)] border border-[var(--c-border)] px-5 py-2 rounded hover:opacity-60 transition-opacity"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
