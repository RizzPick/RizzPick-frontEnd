import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AlarmProps } from '../../types/alarm/type';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import { ChatData } from '@/types/chat';
import useSWR from 'swr';
import ChatAPI from '@/features/chat';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';
import Like from "../../../public/notificationsIcon/Like.svg"

interface LikeData {
    nickname: string;
    userId: number;
    profilePic: {
        id: number;
        image: string;
    };
}

export default function Alarm({ close }: AlarmProps) {
    const [closeModal] = useState(true);
    const { initializeChats } = UseChat();
    const { data: chats } = useSWR<ChatData[]>(CHAT_KEY);
    const router = useRouter();
    const [likesData, setLikesData] = useState<LikeData[]>([]); // Specify the type here

    useEffect(() => {
        const getChatRooms = async () => {
            try {
                const response = await ChatAPI.getChats();
                if (response.status === 200) {
                    initializeChats(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

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
                return setLikesData(response.data.data); // Set the likes data
            } catch (error) {
                console.error(error);
            }
        };

        getChatRooms();
        fetchLikesData();
    }, [initializeChats]);

    const onClick = () => {
        close();
        router.push('/user/chat');
    };

    return (
        <>
            {closeModal && (
                <div className="absolute top-[100px] right-[60px] translate-[-50%] bg-white p-6 w-[400px] h-[500px] flex flex-col z-50 border border-zinc-800 rounded-3xl">
                    <div className="h-[20vh]">
                        <h2 className="mb-2 cursor-pointer" onClick={()=>router.push('/user/notifications/liked')}>
                            좋아요 ({likesData.length})
                        </h2>
                        <div
                            className="flex flex-row border-t-[1px] py-4 px-3 gap-5 flex-grow-0"
                            style={{
                                borderColor: 'black',
                                overflowX: 'auto', // 가로 스크롤을 활성화합니다.
                                whiteSpace: 'nowrap', // 내용을 한 줄에 유지합니다.
                            }}
                        >
                            {likesData.map((like, index) => (
                                    <div onClick={()=>router.push('/user/notifications/liked')} className="rounded-full w-[70px] h-[70px] flex items-center justify-center cursor-pointer" key={like.userId}>
                                        <div className="relative w-[60px] h-[60px]">
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
                    <h2 className="mb-2 font-bold text-2xl mt-4">메시지</h2>
                    <div className="h-full overflow-y-auto scrollbar-hide">
                        <div className="border-t-[1px] border-black">
                            {chats?.map((chat) => {
                                return (
                                    <div
                                        className="flex flex-row items-center border-b-[1px] border-transparent h-20 cursor-pointer"
                                        style={{ borderColor: 'black' }}
                                        key={chat.chatRoomId}
                                        onClick={onClick}
                                    >
                                        <div className="rounded-full overflow-hidden w-[50px] h-[50px] mr-4 relative">
                                            <Image
                                                src={chat.image}
                                                alt="Picture of the author"
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <span className="text-2xl">
                                                    {chat.nickname}
                                                </span>
                                                &nbsp;
                                                <span>{chat.age}</span>
                                            </div>
                                            <p className="w-full text-ellipsis overflow-hidden break-words line-clamp-2 text-sm text-gray-600 font-bold">
                                                {chat.latestMessage}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
