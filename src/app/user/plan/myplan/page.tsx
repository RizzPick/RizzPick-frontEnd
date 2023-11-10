import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import MyPlanList from '@/components/plan/MyPlanList';

export default function matchPage() {
    return (
        <>
            {/* <Header /> */}
            <MyPlanList />
            <Footer />
        </>
    );
}
