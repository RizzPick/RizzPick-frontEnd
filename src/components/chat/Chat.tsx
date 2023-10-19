'use client'
import React from 'react';
import SendIcon from '../../../public/chatIcon/send.svg';
import MoreIcon from '../../../public/chatIcon/more.svg';
import ChatRoom from './ChatRoom';

const Chat = () => {
    return (
        <div>
            {/* 채팅창 */}
            <div className="flex-grow h-screen border-r-[2px] border-l-[2px] border-s-1-black-900">
                <div className="rounded-2xl bg-slate-800 h-[80vh] my-10 pl-7 pt-7">
                    <div className="rounded-2xl bg-white w-[586px] h-[72vh]">
                        {/* 채팅내용 */}
                        <div className="flex-grow h-[66vh]  border-b-[2px] border-s-2-#BBBBBB ">
                        <ChatRoom chatRoomId={5581755}/>
                        </div>

                        {/* 보내는 구간 */}
                        <div className=" flex relative items-center h-4 my-4 mx-1 ">
                            <button>
                                <MoreIcon />
                            </button>
                            <input
                                className=" mx-1 w-full h-8 pr-[20px] rounded-2xl p-2 focus:outline-none border-[2px] border-s-2-#BBBBBB"
                                placeholder="내용을 입력해주세요!!"
                            ></input>
                            <button className="absolute top-[-8px] right-[35px] transform translate-x-full h-8">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
