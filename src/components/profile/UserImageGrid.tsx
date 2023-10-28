'use client'
import React, { useState } from 'react';
import UserImageCard from './UserImageCard';
import { MyProfileRes } from '@/types/profile';
import useSWR, { mutate } from 'swr';
import { PROFILE_KEY } from '@/hooks/useProfile';
import ProfileAPI from '@/features/profile';

function UserImageGrid() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null); 
  const { data: profile, isValidating } = useSWR<MyProfileRes>(PROFILE_KEY);

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
      // Update local data using SWR's mutate
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
    <section className='w-full p-8'>
      <div className='border p-4 bg-white rounded-xl border-black'>
        <h2 className='mb-5 text-xl font-bold'>사진 등록하기</h2>
        <div className='grid grid-cols-3 gap-4 p-4'>
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
        <p className='font-semibold text-sm'>📸 사진은 얼굴 사진과 전신 사진을 추가하면 더 정확한 이상형과 매칭되기 좋아요!</p>
      </div>
    </section>
  );
}

export default UserImageGrid;
