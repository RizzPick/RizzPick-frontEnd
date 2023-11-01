import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Match from '@/components/match/Match';

export default function matchPage() {
    return (
        <div className="bg-white">
            <Header />
            <Match userId="userId" />
            <Footer />
        </div>
    );
}
