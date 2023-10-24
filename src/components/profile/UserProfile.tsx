'use client'
import { UserInfo } from '@/types/user'
import Image from 'next/image';
import React, { useState } from 'react'

type Props = {
    profile : UserInfo
}
function UserProfile({profile} : Props) {
    const [images, setImages] = useState(profile.data.profileImages);
    const [currentImage, setCurrentImage] = useState(profile.data.profileImages[0]);
    console.log(currentImage);
  return (
    <div>
        {images.map((image)=> {
            return <Image src={image.image} width={400} height={700} alt='프로필 이미지' key={image.id}/>
        })}
    </div>
  )
}

export default UserProfile