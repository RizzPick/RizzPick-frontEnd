import Image from 'next/image'
import React from 'react'
import profiledog from '../../../public/images/profiledog.jpeg';

function ChatProfile() {
  return (
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
  )
}

export default ChatProfile