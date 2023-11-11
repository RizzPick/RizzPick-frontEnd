import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Board from '@/components/plan/Board';
// import { EventSourceProvider } from '../../EventSourceContext';

export default function BoardPage() {
    return (
        <>
            {/* <EventSourceProvider> */}
            <Board />
            <Footer />
            {/* </EventSourceProvider> */}
        </>
    );
}
