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
    function timeAgo(createdAt: string): string {
        // 영국 시간을 해석합니다.
        const date = new Date(createdAt);
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', createdAt);
            return '';
        }
        // 영국 시간을 서울 시간으로 변환합니다.
        const seoulDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

        const now = new Date();
        // 서울 시간 기준으로 시간 차이를 계산합니다.
        const diffMs = now.getTime() - seoulDate.getTime();
        const diffSecs = diffMs / 1000;
        const diffMins = diffSecs / 60;
        const diffHours = diffMins / 60;
        const diffDays = diffHours / 24;

        if (diffDays >= 1) {
            return `${Math.floor(diffDays)}일 전`;
        } else if (diffHours >= 1) {
            return `${Math.floor(diffHours)}시간 ${Math.floor(
                diffMins % 60
            )}분 전`;
        } else {
            return `${Math.floor(diffMins)}분 전`;
        }
    }

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
