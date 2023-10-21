import { Dating } from '@/types/plan/board/type';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/girlprofile.jpeg';

type Props = { dating: Dating };
export default function DatingCard({
    dating: { datingTitle, datingTheme, datingId },
}: Props) {
    return (
        <Link href={`${datingId}`}>
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
