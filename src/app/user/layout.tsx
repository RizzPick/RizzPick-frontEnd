'use client'
import Header from '@/components/common/Header';

export default function UserLayout({
    children, showHeader = false}: {
    children: React.ReactNode; showHeader:boolean
}) {
    return (
        <section>
            {showHeader && <Header />}
            {children}
        </section>
    );
}
