'use client'
import React, { useState } from 'react';
import UserImageCard from './UserImageCard';
import { MyProfileRes } from '@/types/profile';
import useSWR, { mutate } from 'swr';
import { PROFILE_KEY } from '@/hooks/useProfile';
import ProfileAPI from '@/features/profile';
import { useRouter } from 'next/navigation';

function UserImageGrid({onPrev} : any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null); 
  const { data: profile, isValidating } = useSWR<MyProfileRes>(PROFILE_KEY);
  const router = useRouter();

  const handleModalOpen = (index: number) => {
    setSelectedImage(index);
    setModalVisible(true);
  };

  const addImage = async (file: File) => {
    const formData = new FormData();
    formData.append('action', "ADD");
    formData.append('image', file);
    try {
      const response = await ProfileAPI.updateImage(formData);
      mutate(PROFILE_KEY, (currentData:any) => ({
        ...currentData,
        profileImages: [...currentData.profileImages, response.data.data]
      }), false);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const deleteImage = async (imageId: number) => {
    const formData = new FormData();
    formData.append('action', "DELETE");
    formData.append('id', imageId.toString());
    try {
      await ProfileAPI.updateImage(formData);
      mutate(PROFILE_KEY, (currentData:any) => ({
        ...currentData,
        profileImages: currentData.profileImages.filter((image:any) => image.id !== imageId)
      }), false);
    } catch (error) {
      console.error("Image delete failed:", error);
    }
  };

  return (
    <div>
      <div className='w-[506px] h-[551px] p-2 sm:bg-profile-gradient sm:mt-4 rounded-xl sm:rounded-3xl sm:w-[100vw] sm:h-[100vh] mx-auto border border-black sm:border-none scrollbar-hide bg-white'>
      <h1 className='justify-center text-zinc-800 text-2xl leading-10 tracking-widest mb-3 sm:flex hidden'>프로필 등록</h1>
        <div className='bg-white p-4 rounded-2xl'>
          <h2 className='mb-5 text-zinc-800 text-xl font-medium leading-tight tracking-wide'>사진 등록</h2>
          <div className='grid grid-cols-3 gap-4'>
            {[...Array(6)].map((_, index) => (
              <UserImageCard 
                key={index}
                onAddImage={addImage}
                onDeleteImage={deleteImage}
                onImageClick={() => handleModalOpen(index)}
                isModalVisible={isModalVisible && selectedImage === index}
                setModalVisible={setModalVisible}
                image={profile?.profileImages && profile.profileImages[index] ? profile.profileImages[index] : null}
                isLoading={isValidating}
              />
            ))}
          </div>
          <p className='text-zinc-800 text-xs font-medium leading-none tracking-wide mt-5 w-[276px]'>✱얼굴 사진과 전신 사진을 추가하면 더 정확한 이상형과 매칭되기 좋아요!</p>
        </div>
        <div className='mt-10'>
          <button onClick={onPrev} className="m-[14px] text-stone-500 text-base font-medium font-['SUITE'] leading-none tracking-wide w-24 h-10 bg-white rounded-3xl transition duration-200 hidden sm:block sm:float-left hover:bg-neutral-200 hover:shadow shadow-inner">이전</button>
          <button onClick={()=>{router.push('/profile'), alert('프로필 등록이 완료되었습니다!')}} className="m-[14px] text-stone-500 text-base font-medium font-['SUITE'] leading-none tracking-wide w-24 h-10 bg-white rounded-3xl transition duration-200 hidden sm:block sm:float-right hover:bg-neutral-200 hover:shadow shadow-inner">완료</button>
        </div>
      </div>
    </div>
  );
}

export default UserImageGrid;
