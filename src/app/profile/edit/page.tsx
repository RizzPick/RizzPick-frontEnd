'use client'
import UserImageGrid from '@/components/profile/UserImageGrid';
import UserProfileEdit from '@/components/profile/UserProfileEdit';
import ProfileAPI from '@/features/profile'
import UseProfile from '@/hooks/useProfile';
import React, { useEffect } from 'react'

function ProfilEditPage() {
  const { initializeProfile } = UseProfile();
  
  useEffect(()=>{
    const getProfile = async() => {
      try {
        const response = await ProfileAPI.getMyProfile();
        console.log(response);
        if(response.status === 200) {
          initializeProfile(response.data.data);
        }
      } catch(error) {
        console.log(error);
      }
    }
    getProfile();
  },[initializeProfile])
  
  return (
    <div>
      <h2 className='text-center font-bold text-3xl p-4'>프로필 등록</h2>
      <div className='grid grid-cols-2 bg-white'>
        <UserProfileEdit />
        <UserImageGrid />
      </div>
    </div>
  )
}

export default ProfilEditPage