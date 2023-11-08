'use client'
import UserImageGrid from '@/components/profile/UserImageGrid';
import UserProfileEdit from '@/components/profile/UserProfileEdit';
import ProfileAPI from '@/features/profile'
import UseProfile from '@/hooks/useProfile';
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';

function ProfilEditPage() {
  const { initializeProfile } = UseProfile();
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [mobile, setMobile] = useState(false);

  const isMobile = useMediaQuery({
    query : "(max-width:767px)"
  });
  
  useEffect(() => {
    setMobile(isMobile)
  }, [isMobile])

  useEffect(()=>{
    const getProfile = async() => {
      try {
        const response = await ProfileAPI.getMyProfile();
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
    {mobile ? 
    (
      <div className='grid grid-cols-1 sm:h-[100vh]'>
        {!showImageGrid && <UserProfileEdit onNext={() => setShowImageGrid(true)} />}
        {showImageGrid && <UserImageGrid onPrev={() => setShowImageGrid(false)} />}
      </div>
    ) : 
    (
      <div className='bg-profile-edit-gradient w-[100vw] h-full p-4 '>
        <h1 className='flex justify-center text-4xl py-14'>프로필 등록</h1>
          <div className='flex justify-center gap-32 relative'>
            <UserProfileEdit />
            <UserImageGrid />
          </div>
      </div>
    )}
  </div>
  )
}

export default ProfilEditPage