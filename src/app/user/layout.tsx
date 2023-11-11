'use client'
import Header from '@/components/common/Header';
import { ReactNode } from 'react';

interface UserLayoutProps {
    children: ReactNode;
    showHeader?: boolean; // showHeader는 선택적 프로퍼티입니다.
  }

export default function UserLayout({
    children, showHeader = false}: UserLayoutProps) {
    return (
        <section>
            {showHeader && <Header />}
            {children}
        </section>
    );
}
