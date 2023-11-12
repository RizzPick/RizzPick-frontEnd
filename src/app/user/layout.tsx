import Header from '@/components/common/Header';

export default function UserLayout({children, showHeader = false}: any) {
    return (
        <>
            {showHeader && <Header />}
            {children}
        </>
    );
}
