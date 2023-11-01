import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import UserProfile from '@/components/profile/UserProfile';
import UserProfileMobile from '@/components/profile/UserProfileMobile';
import React from 'react'

export default async function ProfilePage() {
    
  return (
    <div>
      <div className='sm:hidden'>
        <Header />
        <UserProfile />
      </div>

      <div className='sm:block hidden'>
        <Header />
        <UserProfileMobile />
        <Footer />
      </div>
    </div>
  )
}