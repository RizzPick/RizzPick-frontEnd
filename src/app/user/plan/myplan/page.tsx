import Footer from '@/components/common/Footer';
import MyPlanList from '@/components/plan/MyPlanList';
import Header from '@/components/common/Header';

export default function matchPage() {
    const showHeader = true;

    return (
        <>
            {showHeader && <Header />}
            <MyPlanList />
            <Footer />
        </>
    );
}
