import { Dating } from '@/types/plan/board/type';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../../../public/images/girlprofile.jpeg';
import { useEffect, useState } from 'react';

type Props = { dating: Dating };
export default function DatingCard({
    dating: {
        datingTitle,
        datingTheme,
        datingId,
        userNickname,
        createdAt,
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

        let result = '';
        if (daysDifference > 0) {
            result = `${daysDifference}일 전`;
        } else {
            if (hoursDifference > 0) {
                result += `${hoursDifference}시간 `;
            }
            if (minutesDifference > 0 || hoursDifference > 0) {
                // Update this line to include hours
                result += `${minutesDifference}분 `;
            }
            result += '전';
        }
        return result;
    };

    const [timeDifferenceString, setTimeDifferenceString] =
        useState<string>('');

    useEffect(() => {
        // createdAt 변수는 서버에서 가져온 데이터라고 가정합니다.
        const differenceString = timeAgo(createdAt);
        setTimeDifferenceString(differenceString);
    }, [createdAt]);

    return (
        <Link href={`${datingId}`}>
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
