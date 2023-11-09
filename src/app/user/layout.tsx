import RealTime from '@/components/alarm/RealTime';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rizz Pick',
    description: '만나서 뭘 할까 고민 없이 바로 Rizz Pick 나만의 데이트 계획을 공유해보세요',
    viewport: 'width=device-width,initial-scale=1',
    icons : {
        icon : "/favicon.ico"
    }
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div>
                <RealTime />
            </div>
            {children}
        </section>
    );
}
