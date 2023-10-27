import Image from 'next/image';
import axios from 'axios';
import profile1 from '../../../public/images/profile1.jpeg';
import { useEffect, useState } from 'react';
import { AlarmProps } from '../../types/alarm/type';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import { ChatData } from '@/types/chat';
import useSWR from 'swr';
import ChatAPI from '@/features/chat';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';

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
                console.log('asdasd', response.data.data);
                return setLikesData(response.data.data); // Set the likes data
            } catch (error) {
                console.error(error);
            }
        };

        getChatRooms();
        fetchLikesData(); // Call the fetchLikesData function
    }, [initializeChats]);

    const onClick = () => {
        close();
        router.push('/user/chat');
    };

    return (
        <>
            {closeModal && (
                <div className="absolute top-[70px] right-[50px] translate-[-50%] bg-white p-10 w-[500px] h-[80vh] flex flex-col z-50">
                    <div className="h-36">
                        <h2 className="mb-2">
                            받은 좋아요 ({likesData.length})
                        </h2>
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
                    <div className="rounded-2xl">
                        <h2 className="mb-2 font-bold text-2xl">메시지</h2>
                        <div className="overflow-y-auto h-[calc(70vh-36px)]">
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
                                                <span className="font-bold">
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
