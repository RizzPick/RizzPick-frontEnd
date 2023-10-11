import Image from 'next/image';
import profile1 from '../../../public/images/profile1.jpeg';
import { useState } from 'react';
import { AlarmProps } from '../../types/alarm/type';

export default function Alarm({ close }: AlarmProps) {
    const [closeModal] = useState(true);

    return (
        <>
            {closeModal && (
                <div className="absolute top-[70px] right-[50px] translate-[-50%] bg-white rounded-2xl p-10 w-[500px] h-[100vh] flex z-50">
                    <div
                        className="flex flex-row items-center border-t-[1px] border-b-[1px] border-transparent h-20"
                        style={{ borderColor: 'black' }}
                    >
                        <div className="rounded-full overflow-hidden w-[100px] h-[50px] mr-4">
                            <Image
                                src={profile1}
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
                            <p className="w-full text-ellipsis overflow-hidden break-words line-clamp-2 text-sm text-gray-600">
                                두 줄 정도 보이도록 했어요 만약 2줄이 넘어가면
                                이렇게 보인답니다. 두 줄 정도 보이도록 했어요
                                만약 2줄이 넘어가면 이렇게 보인답니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
