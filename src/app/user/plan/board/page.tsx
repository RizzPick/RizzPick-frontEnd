import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Board from '@/components/plan/Board';

export default function BoardPage() {
    const showHeader = true;

    return (
        <>
            {showHeader && <Header />}
            <Board />
            <Footer />
        </>
    );
}
