import Footer from '@/components/common/Footer';
import Board from '@/components/plan/Board';
import UserLayout from '../../layout'

export default function BoardPage() {
    return (
        <>
            <div className='sm:hidden'>
                <UserLayout showHeader={true}>
                    <Board />
                    <Footer />
                </UserLayout>
            </div>
            <div className='hidden sm:block'>
                <Board />
                <Footer />
            </div>
        </>
    );
}
