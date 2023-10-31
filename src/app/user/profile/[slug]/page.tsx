import OtherUserProfile from '@/components/profile/OtherUserProfile';
import { MyProfileRes } from '@/types/profile';
import axios from 'axios';
import React from 'react'

type Props = {
  params: {
      slug: string;
  };
};

async function OtherUserProfilepage({ params: { slug } }: Props) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userProfile/${slug}`)
    const profile : MyProfileRes = response.data.data;
  return (
    <div><OtherUserProfile profile={profile}/></div>
  )
}

export default OtherUserProfilepage