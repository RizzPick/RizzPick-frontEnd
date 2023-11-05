import OtherUserProfile from '@/components/profile/OtherUserProfile';
import { MyProfileRes } from '@/types/profile';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react'

type Props = {
  params: {
      slug: string;
  };
};

async function OtherUserProfilepage({ params: { slug } }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('Authorization');
  const token = accessToken?.value;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userProfile/${slug}`,{
      headers : {
        "Authorization" : token
      }
    })
    const profile : MyProfileRes = response.data.data;
  return (
    <div><OtherUserProfile profile={profile}/></div>
  )
}

export default OtherUserProfilepage