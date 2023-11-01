import { Dating } from '@/types/plan/board/type';
import DatingCard from './Card';

type Props = { datings: Dating[] };
export default function DatingGrid({ datings }: Props) {
    return (
        <ul className="grid gap-10 grid-cols-4 sm:grid-cols-2 sm:gap-4">
            {datings.map((dating) => (
                <li key={dating.datingId} className="w-[233px] h-[349px]">
                    <DatingCard dating={dating}></DatingCard>
                </li>
            ))}
        </ul>
    );
}
