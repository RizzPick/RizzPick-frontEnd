import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';


export const metadata: Metadata = {
    title: 'Will You',
    description: 'Generated by create next app',
    viewport: 'width=device-width,initial-scale=1'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) 
{
    return (
        <html lang="en">
            <body style={{fontFamily:'SUITE'}}>
                <Toaster position='top-center' toastOptions={{duration:1500}}/>
                {children}
            </body>
        </html>
    );
}
