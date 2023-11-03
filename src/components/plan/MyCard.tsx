import { MyDating } from '@/types/plan/myplan/type';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/girlprofile.jpeg';
import { useEffect, useState } from 'react';

type Props = { myDating: MyDating };
export default function MyCard({
    myDating: {
        datingTitle,
        datingTheme,
        datingId,
        createdAt,
        userNickname,
        userProfilePic,
    },
}: Props) {
    const timeAgo = (createdAt: string) => {
        const now = new Date().getTime();
        const createdDate = new Date(createdAt).getTime();
        const differenceInMilliseconds = now - createdDate;

        const daysDifference = Math.floor(
            differenceInMilliseconds / (1000 * 3600 * 24)
        );
        const hoursDifference = Math.floor(
            (differenceInMilliseconds % (1000 * 3600 * 24)) / (1000 * 3600)
        );
        const minutesDifference = Math.floor(
            (differenceInMilliseconds % (1000 * 3600)) / (1000 * 60)
        );

        if (daysDifference > 0) {
            return `${daysDifference}일 전`;
        } else {
            let result = '';
            if (hoursDifference > 0) {
                result += `${hoursDifference}시간 `;
            }
            if (minutesDifference > 0) {
                result += `${minutesDifference}분 `;
            }
            return result + '전';
        }
    };

    const [timeDifferenceString, setTimeDifferenceString] =
        useState<string>('');

    useEffect(() => {
        // createdAt 변수는 서버에서 가져온 데이터라고 가정합니다.
        const differenceString = timeAgo(createdAt);
        setTimeDifferenceString(differenceString);
    }, [createdAt]);

    return (
        <Link href={`myplan/${datingId}`}>
            <article className=" flex flex-col justify-between rounded-md overflow-hidden shadow-lg hover:shadow-xl w-[233px] h-[349px] bg-white sm:w-[153px] sm:h-[218]">
                <div className="relative w-full h-[260px]">
                    <Image
                        className="w-full h-full"
                        src={userProfilePic.image}
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
                    <div className="flex flex-row mt-2 items-center justify-between">
                        <span className="text-sm">{userNickname}</span>
                        <span className="text-xs text-end mt-1 text-[#999999]">
                            {timeDifferenceString}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
