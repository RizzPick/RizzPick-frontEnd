'use client'
import { UserInfo } from '@/types/user'
import Image from 'next/image';
import React, { useState } from 'react'
import MultiCarousel from '../common/MultiCarousel';

type Props = {
    profile : UserInfo
}
function UserProfile({profile} : Props) {
    const [images, setImages] = useState(profile.data.profileImages);
    const [currentImage, setCurrentImage] = useState(profile.data.profileImages[0]);
    console.log(currentImage);
  return (
    <section className="my-4 w-[487px]">
    <MultiCarousel>
      {profile.data.profileImages.map((image) => 
      <article key={image.id} className='rounded-3xl overflow-hidden w-[487px] h-[731px] relative'>
        <Image src={image.image} alt='프로필 이미지' fill style={{objectFit : 'cover'}} priority className='rounded-md'/>
        <div className='flex flex-col p-4 border w-[487px] mx-auto rounded-3xl absolute -bottom-0 bg-white'>
          <div className='flex justify-between w-full'>
            <h3 className='font-bold text-2xl'>{profile.data.nickname}</h3>
            <p className='text-gray-400'>{profile.data.age}</p>
          </div>
          <div className='justify-start flex'>{profile.data.intro}</div>
        </div>
      </article>)}
    </MultiCarousel>
  </section>
  )
}

export default UserProfile