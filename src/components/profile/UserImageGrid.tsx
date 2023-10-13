'use client'
import React, { useState } from 'react';
import UserImageCard from './UserImageCard';
import { MyProfileRes } from '@/types/profile';
import useSWR from 'swr';
import { PROFILE_KEY } from '@/hooks/useProfile';

function UserImageGrid() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null); 
  const { data: profile, isValidating } = useSWR<MyProfileRes>(PROFILE_KEY);

  const handleModalOpen = (index: number) => {
    setSelectedImage(index);
    setModalVisible(true);
  };

  return (
    <section className='w-full'>
      <h2 className='mb-5 text-xl font-bold'>사진 등록하기</h2>
      <div className='flex gap-4 justify-around flex-wrap p-4'>
        {[...Array(6)].map((_, index) => (
          <UserImageCard 
            key={index}
            onImageClick={() => handleModalOpen(index)}
            isModalVisible={isModalVisible && selectedImage === index}
            setModalVisible={setModalVisible}
            image={profile?.profileImages && profile.profileImages[index] ? profile.profileImages[index] : null}
            isLoading={isValidating}
          />
        ))}
      </div>
    </section>
  );
}

export default UserImageGrid;
