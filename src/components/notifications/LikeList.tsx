'use client'
import { getCookie } from '@/utils/cookie';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Like from "../../../public/notificationsIcon/Like.svg"

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
        <h2 className='text-zinc-800 text-xl font-semibold leading-tight tracking-wide px-5 pb-2.5'>좋아요({likesData.length})</h2>
        <div
            className="flex flex-row border-t-[1px] py-5 px-3 gap-5"
            style={{
                borderColor: 'black',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
            }}
        >
            {likesData.map((like, index) => (
                <div
                    className="rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-700 w-[95px] h-[95px] flex"
                    key={like.userId}
                >
                        <div className="rounded-full w-[85px] h-[85px] relative mx-auto my-auto">
                            <Image
                                src={like.profilePic.image}
                                alt={like.nickname}
                                fill
                                style={{objectFit:'cover'}}
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

export default LikeList