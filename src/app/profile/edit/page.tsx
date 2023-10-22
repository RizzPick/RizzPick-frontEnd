'use client'
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
    <section className='container mx-auto w-full mt-10 bg-white rounded shadow flex p-4 gap-4'>
      <UserProfileEdit />
    </section>
  )
}

export default ProfilEditPage