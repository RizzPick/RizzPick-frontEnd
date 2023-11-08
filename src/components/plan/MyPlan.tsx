import { MyDating } from '@/types/plan/myplan/type';
import MyCard from './MyCard';

type Props = { myDatings: MyDating[] };
export default function MyPlan({ myDatings }: Props) {
    return (
        <ul className="grid gap-4 grid-cols-3 sm:grid-cols-1 sm:gap-4">
            {myDatings?.map((myDating) => (
                <li
                    key={myDating.datingId}
                    className="w-[233px] h-[349px] ml-10 sm:m-0"
                >
                    <MyCard myDating={myDating}></MyCard>
                </li>
            ))}
        </ul>
    );
}
