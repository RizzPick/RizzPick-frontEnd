import UserProfile from '@/components/profile/UserProfile';
import { UserInfo } from '@/types/user';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react'

export default async function ProfilePage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`, {
        headers : {
            "Authorization" : token
        }
    })
    const profile : UserInfo = response.data;
    console.log(profile);

  return (
    <div><UserProfile profile={profile}/></div>
  )
}