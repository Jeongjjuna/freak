import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header/Header';
import {DrawerProvider} from '@/components/Drawer/DrawerProvider';
import {getAllCategories, getRecentPosts} from '@/lib/posts';
import SakuraPetals from '@/components/SakuraPetals/SakuraPetals';

export const metadata: Metadata = {
  title: 'Freak Blog',
  description: '개발하며 배운 것들을 기록하는 블로그',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <html lang="ko" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: `(function(){if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}if(localStorage.getItem('color-theme')==='sakura'){document.documentElement.classList.add('sakura')}})()` }} />
    </head>
    <body>
    <DrawerProvider categories={categories} recentPosts={recentPosts}>
      <SakuraPetals />
      <Header/>
      <nav className="max-w-290 mx-auto px-6">
        <div className="py-3 flex items-center gap-10 pl-11 max-[1200px]:pl-0 max-[1200px]:mx-3 border-t border-b border-[var(--c-border)]">
          <Link href="/" className="text-[15px] text-[var(--c-text)] hover:opacity-60 transition-opacity">홈</Link>
          <Link href="/tags" className="text-[15px] text-[var(--c-text)] hover:opacity-60 transition-opacity">태그</Link>
        </div>
      </nav>
      {children}
    </DrawerProvider>
    </body>
    </html>
  );
}
