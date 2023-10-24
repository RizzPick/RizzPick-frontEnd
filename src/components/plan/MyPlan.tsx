import { MyDating } from '@/types/plan/myplan/type';
import MyCard from './MyCard';

type Props = { myDatings: MyDating[] };
export default function MyPlan({ myDatings }: Props) {
    return (
        <ul className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {myDatings?.map((myDating) => (
                <li key={myDating.datingId}>
                    <MyCard myDating={myDating}></MyCard>
                </li>
            ))}
        </ul>
    );
}
