import { Dating } from '@/types/plan/board/type';
import DatingCard from './Card';

type Props = { datings: Dating[] };
export default function DatingGrid({ datings }: Props) {
    return (
        <ul className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {datings.map((dating) => (
                <li key={dating.datingId}>
                    <DatingCard dating={dating}></DatingCard>
                </li>
            ))}
        </ul>
    );
}
