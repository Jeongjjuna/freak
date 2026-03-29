import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header/Header';

export const metadata: Metadata = {
  title: 'Freak Blog',
  description: '개발하며 배운 것들을 기록하는 블로그',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="ko">
    <body>
    <Header/>
    <nav className="max-w-290 mx-auto px-6">
      <div className="py-3 flex items-center gap-10 pl-11 max-[1200px]:pl-0 max-[1200px]:mx-3 border-t border-b border-[#e5e5e5]">
        <Link href="/" className="text-[15px] text-[#3a4954] hover:opacity-60 transition-opacity">홈</Link>
        <Link href="/tags" className="text-[15px] text-[#3a4954] hover:opacity-60 transition-opacity">태그</Link>
      </div>
    </nav>
    {children}
    </body>
    </html>
  );
}
