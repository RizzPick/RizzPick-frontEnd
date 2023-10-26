import Header from '@/components/header/Header';
import Match from '@/components/match/Match';

export default function matchPage() {
    return (
        <div className="bg-main-background">
            <Match userId="userId" />
        </div>
    );
}
