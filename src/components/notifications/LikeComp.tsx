'use client'
import { getCookie } from '@/utils/cookie';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Like from "../../../public/notificationsIcon/Like.svg"
import { LikeData } from '@/types/like';
import UseLiked from '@/hooks/useLiked';
import { useRouter } from 'next/navigation';

function LikeComp() {
    const [likesData, setLikesData] = useState<LikeData[]>([]);
    const router = useRouter();
    const {initializeLiked} = UseLiked();

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
                initializeLiked(response.data.data);
                return setLikesData(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLikesData();
    },[initializeLiked])
  return (
    <div>
        <h2 onClick={()=>router.push('notifications/liked')} className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide px-5 pb-2.5'>좋아요({likesData.length})</h2>
        <div
            className="flex flex-row border-t-[1px] py-5 px-3 gap-5 scrollbar-hide"
            style={{
                borderColor: 'black',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
            }}
        >
            {likesData.map((like, index) => (
                <div
                    className="bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-700 w-[95px] h-[95px] rounded-full p-2 flex items-center justify-center"
                    key={like.userId}
                >
                        <div className='relative w-[85px] h-[85px]'>
                            <Image
                                src={like.profilePic.image}
                                alt={like.nickname}
                                fill
                                // style={{objectFit:'cover'}}
                                className='rounded-full'
                            />
                            <div className='absolute -bottom-2 right-0 -mr-3'>
                                <Like />
                            </div>
                        </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LikeComp