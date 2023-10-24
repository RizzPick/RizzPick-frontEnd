import { MyDating } from '@/types/plan/myplan/type';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/girlprofile.jpeg';

type Props = { myDating: MyDating };
export default function MyCard({
    myDating: { datingTitle, datingTheme, datingId },
}: Props) {
    return (
        <Link href={`myplan/${datingId}`}>
            <article className="rounded-md overflow-hidden shadow-lg hover:shadow-xl w-[300px]">
                <Image
                    className="w-full"
                    src={profile}
                    alt={datingTitle}
                    width={300}
                    height={200}
                />
                <div className="flex flex-col items-center p-4">
                    <h3 className="text-lg font-bold">{datingTitle}</h3>
                    <span className="text-sm rounded-lg bg-green-100 px-2 my-2">
                        {datingTheme}
                    </span>
                </div>
            </article>
        </Link>
    );
}
