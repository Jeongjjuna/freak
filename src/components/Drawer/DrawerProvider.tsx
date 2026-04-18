'use client';

import {createContext, useContext, useState} from 'react';
import type {PostMeta} from '@/types/post';
import {CategoryGroup} from '@/lib/posts';
import MobileDrawer from './MobileDrawer';

interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  groups: CategoryGroup[];
  recentPosts: PostMeta[];
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
}

interface Props {
  groups: CategoryGroup[];
  recentPosts: PostMeta[];
  children: React.ReactNode;
}

export function DrawerProvider({ groups, recentPosts, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close, groups, recentPosts }}>
      {children}
      <MobileDrawer />
    </DrawerContext.Provider>
  );
}
