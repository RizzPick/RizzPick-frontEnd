'use client'
import Header from '@/components/common/Header';
import { ReactNode } from 'react';

type UserLayoutProps  = {
    children: ReactNode;
    showHeader?: boolean;
  }

export default function UserLayout({children, showHeader = false}: UserLayoutProps) {
    return (
        <>
            {showHeader && <Header />}
            {children}
        </>
    );
}
