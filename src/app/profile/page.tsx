import UserProfile from '@/components/profile/UserProfile';
import { MyProfileRes } from '@/types/profile';
import { UserInfo } from '@/types/user';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react'

export default async function ProfilePage() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('Authorization');
    const token = accessToken?.value;

    if(!token) return;
    // const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/myProfile`, {
    //     headers : {
    //         "Authorization" : token
    //     }
    // })
    const response = await fetch(`${process.env.SERVER_URL}/api/myProfile`,{ cache: 'no-store', headers : {
      "Authorization" : token
    } })
        .then((response) => {
        if (!response.ok) {
            throw new Error(
                `This is an HTTP error: The status is ${response.status}`
            );
        }
            return response.json();
        })
        .catch((err) => {
            console.log(err.message);
      });
    const profile : MyProfileRes = response.data;
    console.log("프로필 페이지 렌더링",profile);
  return (
    <div>
      <UserProfile profile={profile}/>
      </div>
  )
}