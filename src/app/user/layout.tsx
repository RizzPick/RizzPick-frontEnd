import Header from '@/components/common/Header';
import { ReactNode } from 'react';

// type Props  = {
//     children: ReactNode;
//     showHeader?: boolean;
//   }

export default function UserLayout({children, showHeader = false}: any) {
    return (
        <>
            {showHeader && <Header />}
            {children}
        </>
    );
}
