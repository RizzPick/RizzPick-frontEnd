'use client'
import { getCookie } from '@/utils/cookie';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface LikeData {
    nickname: string;
    userId: number;
    profilePic: {
        id: number;
        image: string;
    };
}

function LikeList() {
    const [likesData, setLikesData] = useState<LikeData[]>([]); // Specify the type here

    useEffect(()=>{
        const fetchLikesData = async () => {
            try {
                const response = await axios.get(
                    'https://willyouback.shop/api/likedby/status',
                    {
                        headers: {
                            Authorization: getCookie('Authorization'),
                            Authorization_Refresh: getCookie(
                                'Authorization_Refresh'
                            ),
                        },
                    }
                );
                return setLikesData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLikesData(); // Call the fetchLikesData function
    },[])
  return (
    <div>
        <h2 className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide'>좋아요({likesData.length})</h2>
        <div
            className="flex flex-row border-t-[1px]"
            style={{
                borderColor: 'black',
                overflowX: 'auto', // 가로 스크롤을 활성화합니다.
                whiteSpace: 'nowrap', // 내용을 한 줄에 유지합니다.
            }}
        >
            {likesData.map((like, index) => (
                <div
                    className="flex-col my-4"
                    key={like.userId}
                    style={{ minWidth: '100px' }} // 예시로 100px의 최소 너비를 설정합니다. 필요에 따라 조정하세요.
                >
                    <div className="rounded-full bg-[#A627A9] overflow-hidden w-[70px] h-[70px]">
                        <div className="rounded-full overflow-hidden w-[60px] h-[60px] ml-[5px] mt-[5px]">
                            <Image
                                src={like.profilePic.image}
                                alt={like.nickname}
                                width={60}
                                height={60}
                                objectFit="cover"
                            />
                        </div>
                    </div>
                    <h3
                        className="mx-[10px]"
                        style={{
                            maxWidth: '3ch',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {like.nickname}
                    </h3>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LikeList