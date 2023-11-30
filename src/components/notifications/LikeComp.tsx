'use client'
import { getCookie } from '@/utils/cookie';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Like from "../../../public/notificationsIcon/Like.svg"
import { LikeData } from '@/types/like';
import { useRouter } from 'next/navigation';

function LikeComp() {
    const [likesData, setLikesData] = useState<LikeData[]>([]);
    const router = useRouter();

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
        fetchLikesData();
    },[])
  return (
    <div>
        <h2 onClick={()=>router.push('notifications/liked')} className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide px-5 pb-2.5'>좋아요({likesData.length})</h2>
        <div
            onClick={()=>router.push('notifications/liked')} 
            className="flex flex-row border-t-[1px] py-4 px-3 gap-5 scrollbar-hide"
            style={{
                borderColor: 'black',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
            }}
        >
            {likesData.map((like) => (
                <div
                    className="bg-profile-border-gradient w-[95px] h-[95px] rounded-full p-2 flex items-center justify-center"
                    key={like.userId}
                >
                        <div className='relative w-[85px] h-[85px]'>
                            <Image
                                src={like.profilePic.image}
                                alt={like.nickname}
                                fill
                                style={{objectFit:'cover'}}
                                loading='lazy'
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