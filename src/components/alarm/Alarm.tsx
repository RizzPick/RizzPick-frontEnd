import Image from 'next/image';
import profile1 from '../../../public/images/profile1.jpeg';
import { useEffect, useState } from 'react';
import { AlarmProps } from '../../types/alarm/type';
import UseChat, { CHAT_KEY } from '@/hooks/useChat';
import { ChatData } from '@/types/chat';
import useSWR from 'swr';
import ChatAPI from '@/features/chat';
import { useRouter } from 'next/navigation';

export default function Alarm({ close }: AlarmProps) {
    const [closeModal] = useState(true);
    const { initializeChats } = UseChat();
    const {data:chats} = useSWR<ChatData[]>(CHAT_KEY);
    const router = useRouter();

    useEffect(()=>{
        const getChatRooms = async() => {
            try {
                const response = await ChatAPI.getChats();
                if(response.status === 200) {
                    initializeChats(response.data);
                }   
            } catch (error) {
            console.log(error);
            }
        }
        getChatRooms();
    },[initializeChats])

    const onClick = () => {
        close();
        router.push('/user/chat');
    }
    return (
        <>
            {closeModal && (
                <div className="absolute top-[70px] right-[50px] translate-[-50%] bg-white p-10 w-[500px] h-[80vh] flex flex-col z-50">
                    <div className="h-36">
                        <h2 className="mb-2">
                            받은 좋아요( 여기에 갯수 표시 )
                        </h2>
                        <div
                            className="flex flex-row border-t-[1px]"
                            style={{ borderColor: 'black' }}
                        >
                            <div className="flex-col my-4">
                                <div className="rounded-full bg-[#A627A9] overflow-hidden w-[70px] h-[70px]">
                                    <div className="rounded-full overflow-hidden w-[60px] h-[60px]  ml-[5px] mt-[5px]">
                                        <Image
                                            src={profile1}
                                            alt="Picture of the author"
                                            objectFit="cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="mx-[10px]">김연수</h3>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl">
                        <h2 className="mb-2 font-bold text-2xl">메시지</h2>
                        <div className='overflow-y-auto h-[calc(70vh-36px)]'>
                        {chats?.map((chat)=> {
                            return (
                            <div className="flex flex-row items-center border-b-[1px] border-transparent h-20 cursor-pointer" style={{ borderColor: 'black' }} key={chat.chatRoomId} onClick={onClick}>
                            <div className="rounded-full overflow-hidden w-[50px] h-[50px] mr-4 relative">
                                <Image
                                    src={chat.image}
                                    alt="Picture of the author"
                                    fill
                                    style={{objectFit:"cover"}}
                                />
                            </div>
                            <div>
                                <div>
                                    <span className='font-bold'>{chat.nickname}</span>
                                    &nbsp;
                                    <span>{chat.age}</span>
                                </div>
                                <p className="w-full text-ellipsis overflow-hidden break-words line-clamp-2 text-sm text-gray-600 font-bold">
                                    {chat.latestMessage}
                                </p>
                            </div>
                        </div>)
                        })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
