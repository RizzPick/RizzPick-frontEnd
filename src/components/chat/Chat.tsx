import React from 'react';
import Image from 'next/image';
import profiledog from '../../../public/images/profiledog.jpeg';
import SendIcon from '../../../public/chatIcon/send.svg';
import MoreIcon from '../../../public/chatIcon/more.svg';

export default function Chat() {
    return (
        <div className="flex flex-row h-screen w-[100vw] overflow-hidden">
            {/* 채팅목록 */}
            <div className=" flex flex-col w-[429px] overflow-y-auto">
                <div className="flex flex-row items-center border-t-[1px] border-b-[1px] border-s-1-gray-400 h-[122px] my-20  mx-2">
                    <div className="rounded-full overflow-hidden w-[95px] h-[95px] mr-4">
                        <Image
                            src={profiledog}
                            alt="Picture of the author"
                            objectFit="cover" // 이 부분은 이미지 비율을 유지하면서, 주어진 width/height 안에 이미지를 채워넣습니다.
                        />
                    </div>
                    <div>
                        <div>
                            <span>이름</span>
                            &nbsp;
                            <span>나이</span>
                        </div>
                        <p className="w-[180px] text-ellipsis overflow-hidden break-words line-clamp-2 text-xs text-gray-600">
                            두 줄 정도 보이도록 했어요 만약 2줄이 넘어가면
                            이렇게 보인답니다. 두 줄 정도 보이도록 했어요 만약
                            2줄이 넘어가면 이렇게 보인답니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 채팅창 */}
            <div className="flex-grow h-screen border-r-[2px] border-l-[2px] border-s-1-black-900">
                <div className="rounded-2xl bg-slate-800 h-[80vh] my-10 pl-7 pt-7">
                    <div className="rounded-2xl bg-white w-[586px] h-[72vh]">
                        {/* 채팅내용 */}
                        <div className="flex-grow h-[66vh]  border-b-[2px] border-s-2-#BBBBBB ">
                            채팅영역
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

            {/* 대화상대 프로필 */}
            <div className="h-screen w-[395px]">
                <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-5">
                    <Image
                        src={profiledog}
                        alt="Picture of the author"
                        width={231}
                        height={231}
                        priority
                    />
                </div>
                <div> 현재 나와 채팅하는 사람의 정보 / 아래에 넣을 거임</div>
            </div>
        </div>
    );
}
