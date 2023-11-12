import Footer from '@/components/common/Footer';
import MyPlanList from '@/components/plan/MyPlanList';
import UserLayout from '../../layout';

export default function matchPage() {
    return (
        <>
        <div className='sm:hidden'>
            <UserLayout showHeader={true}>
                <MyPlanList />
                <Footer />
            </UserLayout>
            </div>
        <div className='hidden sm:block'>
                <MyPlanList />
                <Footer />
            </div>
        </>
    );
}
