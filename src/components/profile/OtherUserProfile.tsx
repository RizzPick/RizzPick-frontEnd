'use client'
import { MyProfileRes } from '@/types/profile'
import { calculateAge } from '@/utils/dateUtils'
import React, { useState } from 'react'
import Image from 'next/image'
import { GoDotFill } from 'react-icons/go'
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';


type Props = {
    profile : MyProfileRes
}

function OtherUserProfile({profile} : Props) {
  const [slideIndex, setSlideIndex] = useState(0);

    const nextSlide = () => {
        if (!profile) return; 
        setSlideIndex(
            (prevIndex) => (prevIndex + 1) % profile.profileImages.length
        );
    };

    const prevSlide = () => {
        if (!profile) return; 
        setSlideIndex(
            (prevIndex) =>
                (prevIndex - 1 + profile.profileImages.length) %
                profile.profileImages.length
        );
    };
  return (
    <div>
        <div className='h-full bg-profile-gradient p-4'>
          <div className='bg-likelist-gradient rounded-3xl w-[810px] flex flex-col mx-auto h-[100vh]'>
            <div className='flex items-center justify-center py-4'>
              <h1 className='text-white text-3xl'>{profile.nickname},&nbsp;{calculateAge(profile.birthday)}</h1>
            </div>

            <div className='h-full bg-white rounded-3xl p-8'>
                <article className='flex w-full gap-6'>
                  <div className='w-[40vw] border overflow-hidden'>
                  <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-300 via-neutral-400 to-black rounded-[20px] z-10 opacity-20"/>
                        <div className="flex justify-center mt-4">
                            {profile 
                                ? profile.profileImages.map((_, index) => (
                                    <div key={index} className={`mx-1 z-10 text-2xl ${index === slideIndex ? ('text-white'):('text-gray-500')}`}>
                                        <GoDotFill />
                                    </div>
                                ))
                                : null}
                        </div>
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                        >
                            <LeftButton />
                        </button>

                        {profile
                            ? profile.profileImages.map(
                                (imageObj, index) => (
                                    <div
                                        className={
                                            index === slideIndex
                                                ? 'slide active'
                                                : 'slide'
                                        }
                                        key={index}
                                    >
                                        {index === slideIndex && (
                                            <Image
                                                src={imageObj.image}
                                                alt="User"
                                                layout="fill"
                                                objectFit="cover"
                                                className="absolute"
                                                priority
                                            />
                                        )}
                                    </div>
                                )
                            )
                            : null}

                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                        >
                            <RightButton />
                        </button>
                        </div>
                  </div>
                  <div className='w-[60vw] border'>
                    프로필 상세정보 영역
                  </div>
                </article>
            </div>
          </div>
      </div>
  </div>
  )
}

export default OtherUserProfile