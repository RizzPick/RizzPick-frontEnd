import Header from '@/components/common/Header';
import UserProfile from '@/components/profile/UserProfile';
import { MyProfileRes } from '@/types/profile';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react'

export default async function ProfilePage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;

    if(!token) return;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`, {
        headers : {
            "Authorization" : token
        }
    })
    const profile : MyProfileRes = response.data.data;
  return (
    <div>
      <Header />
      <UserProfile profile={profile}/>
      </div>
  )
}