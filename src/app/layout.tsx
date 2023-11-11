import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/common/Header';
import { EventSourceProvider } from './EventSourceContext';

export const metadata: Metadata = {
    title: 'Rizz Pick',
    description:
        '만나서 뭘 할까 고민 없이 바로 Rizz Pick 나만의 데이트 계획을 공유해보세요',
    viewport: 'width=device-width,initial-scale=1',
    icons: {
        icon: '/favicon.ico',
    },
    appleWebApp: { statusBarStyle: 'black-translucent', capable: true },
    themeColor: { color: '#D67DFF' },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
    showHeader?: boolean;
}) {
    return (
        <html lang="ko">
            <head>
                <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, user-scalable=yes"
                />
                <meta name="msapplication-tap-highlight" content="no" />
            </head>
            <body style={{ fontFamily: 'SUITE' }}>
                <EventSourceProvider>
                    {/* {showHeader && <Header />} */}
                    <Toaster
                        position="top-center"
                        toastOptions={{ duration: 1500 }}
                    />
                    {children}
                </EventSourceProvider>
            </body>
        </html>
    );
}
