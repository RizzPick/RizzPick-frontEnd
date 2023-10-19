'use client'
import Image from 'next/image'
import React from 'react'
import profiledog from '../../../public/images/profiledog.jpeg';

function ChatList() {
  return (
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
  )
}

export default ChatList