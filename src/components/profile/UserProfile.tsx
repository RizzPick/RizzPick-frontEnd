'use client'
import { UserInfo } from '@/types/user'
import Image from 'next/image';
import React, { useState } from 'react'
import MultiCarousel from '../common/MultiCarousel';
import { useRouter } from 'next/navigation';
import LocationIcon from "../../../public/profileIcon/location.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import { MyProfileRes } from '@/types/profile';


type Props = {
    profile : MyProfileRes
}
function UserProfile({profile} : Props) {
  // const [images, setImages] = useState(profile.data.profileImages);
  // const [currentImage, setCurrentImage] = useState(profile.data.profileImages[0]);
  const router = useRouter();
  const [showSecondSection, setShowSecondSection] = useState(false); // 두 번째 section을 보여줄지 결정하는 상태

  const onClick = (event : any) => {
    event.stopPropagation();
    router.push('/profile/edit');
  }
  const handleIntroClick = () => {
    setShowSecondSection(prev => !prev);
}

  return (
    <div className='flex items-center justify-center'>
      <section className="my-5 w-[487px]">
      <MultiCarousel>
        {profile.profileImages.map((image) => 
        <article key={image.id} className='rounded-3xl overflow-hidden w-[487px] h-[731px] relative'>
          <Image src={image.image} alt='프로필 이미지' fill style={{objectFit : 'cover'}} priority className='rounded-md'/>
          <div onClick={handleIntroClick} className='cursor-pointer flex flex-col p-4 border w-[487px] mx-auto rounded-3xl absolute -bottom-0 bg-white' id='intro'>
            <div className='flex justify-between w-full'>
              <h3 className='font-bold text-2xl'>{profile.nickname}</h3>
              <p className='text-gray-400 text-lg'>{profile.age}</p>
            </div>
            <div className='justify-start flex font-bold text-lg text-gray-500'>{profile.intro}</div>
          <button onClick={onClick} className='mx-auto px-4 py-2 bg-gradient-end mt-4 w-40 rounded-3xl text-white font-bold hover:bg-pink-300'>정보수정</button>
          </div>
        </article>)}
      </MultiCarousel>
      </section>
      <section className='flex flex-col h-[731px] ml-6' style={{ display: showSecondSection ? 'block' : 'none' }}>
        <div className='w-[467px] border bg-[#CACFFF] h-[398px] rounded-3xl mb-3'>
          <h1 className='text-center text-xl mt-4'>나랑 이런 데이트 어때요</h1>
          <div className='w-[430px] h-[312px] border bg-white mx-auto rounded-3xl mt-4 p-4'>
            <ul className='list-disc pl-5 space-y-2'>
              <li>밥 먹고 영화보기</li>
              <li>비 오는 날 대학로에서 연극 보기</li>
              <li>시원한 날 한강에서 치맥하기</li>
              <li>겨울에 바다 보러가서 감기걸리기</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 bg-profile-gradient text-white p-4 rounded-3xl mb-2 relative h-[315px] w-[467px]" id='options'>
        <div className='border rounded-3xl bg-white text-gray-500 p-4 h-[281px] mt-2.5 flex flex-col gap-4 justify-center'>
        { !profile.location && !profile.education && !profile.mbti && !profile.religion ? 
          <p className="text-center">작성된 내용이 없습니다.</p> 
          : 
          <>
            { profile.location ? <div className='flex items-center gap-2'><LocationIcon/>{profile.location}</div> : null }
            { profile.education ? <div className='flex items-center gap-2'><EducationIcon/>{profile.education}</div> : null }
            { (profile.mbti || profile.religion) && <hr className='border-dashed'/> }
            <div className='flex items-center gap-4'>
              { profile.mbti ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.mbti}</div> : null }
              { profile.religion ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.religion}</div> : null }
            </div>
          </>
        }
        </div>
      </div>
      </section>
  </div>
  )
}

export default UserProfile