import { Dating } from '@/types/plan/board/type';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/girlprofile.jpeg';

type Props = { dating: Dating };
export default function DatingCard({
    dating: { datingTitle, datingTheme, datingId, userNickname },
}: Props) {
    return (
        <Link href={`${datingId}`}>
            <article className=" flex flex-col justify-between rounded-md overflow-hidden shadow-lg hover:shadow-xl w-[233px] h-[349px] bg-white">
                <div className="relative w-full h-[260px]">
                    <Image
                        className="w-full h-full"
                        src={profile}
                        alt={datingTitle}
                        width={233}
                        height={260}
                        objectFit="cover"
                        objectPosition="center"
                    />
                </div>
                <div className="flex flex-col p-4 h-[89px] ">
                    <h3
                        className="text-lg font-bold"
                        style={{
                            maxWidth: '15ch',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {datingTitle}
                    </h3>
                    <span className="text-sm px-2 mt-2">{datingId} 닉네임</span>
                </div>
            </article>
        </Link>
    );
}
