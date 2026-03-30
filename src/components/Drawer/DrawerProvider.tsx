'use client';

import { createContext, useContext, useState } from 'react';
import type { PostMeta } from '@/types/post';
import MobileDrawer from './MobileDrawer';

interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  categories: { name: string; count: number }[];
  recentPosts: PostMeta[];
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
}

interface Props {
  categories: { name: string; count: number }[];
  recentPosts: PostMeta[];
  children: React.ReactNode;
}

export function DrawerProvider({ categories, recentPosts, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close, categories, recentPosts }}>
      {children}
      <MobileDrawer />
    </DrawerContext.Provider>
  );
}
