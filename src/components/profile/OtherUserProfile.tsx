'use client'
import { MyProfileRes } from '@/types/profile'
import { useRouter } from 'next/navigation'
import React from 'react'
import Back from "../../../public/chatIcon/Button.svg"
import Image from 'next/image'
import Home from "../../../public/profileIcon/Home.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import axios from 'axios'
import { getCookie } from '@/utils/cookie'
import toast from 'react-hot-toast'

type Props = {
    profile : MyProfileRes
}

function OtherUserProfile({profile} : Props) {
    const router = useRouter();
    const sendLike = async (targetUserId: any) => {
        try {
            const url = `https://willyouback.shop/api/like/${targetUserId}`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleLike = async () => {
        try {
            const response = await sendLike(profile.userId);
            toast(response.data.message, {icon: '❤️',});
            router.push('/user/match');
        } catch (error) {
            console.error('좋아요 보내기 오류:', error);
        }
    };

    const sendNope = async (targetUserId: any) => {
        try {
            const url = `https://willyouback.shop/api/nope/${targetUserId}`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: getCookie('Authorization'),
                        Authorization_Refresh: getCookie(
                            'Authorization_Refresh'
                        ),
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleNope = async () => {
        try {
            const response = await sendNope(profile.userId);
            router.push('/user/match');
        } catch (error) {
            console.error('싫어요 보내기 오류:', error);
        }
    };

  return (
    <div className='w-full h-[100vh]'>
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4'>
            <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
            <h1>{profile.nickname}</h1>
        </header>
        <div className='relative w-[187px] h-[187px] mx-auto mt-[41px]'>
            <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill className='rounded-full' style={{objectFit:"cover"}} priority />
        </div>
        <div className='flex items-center justify-center mt-[33px] text-zinc-800 text-2xl'>{profile.nickname}, {profile.age}</div>
        <div className='p-4'>
            <div className='mt-[33px] px-4 py-1 h-[142px] flex flex-col gap-3 bg-neutral-100 rounded-2xl justify-center'>
                    {!profile.location && !profile.education && !profile.mbti && !profile.religion ? 
                        <p className="text-center">작성된 내용이 없습니다.</p> 
                        : 
                        <>
                            { profile.education ? <><div className='flex items-center gap-4'><EducationIcon/>{profile.education}</div><hr/></> : null }
                            { profile.location ? <div className='flex items-center gap-4'><Home/>{profile.location}</div> : null }
                            <div className='flex items-center gap-4 justify-center mt-3'>
                                { profile.mbti ? <div className='px-3 py-1 border border-fuchsia-400 text-fuchsia-400 rounded-3xl'>#{profile.mbti}</div> : null }
                                { profile.religion ? <div className='px-3 py-1 border border-fuchsia-400 text-fuchsia-400 rounded-3xl'>#{profile.religion}</div> : null }
                            </div>
                        </>
                    }
            </div>
            {/* 좋아요, 싫어요 버튼 */}
            <div className="text-white w-[30vw] flex justify-center items-center mx-auto sm:gap-10 mt-6 gap-80">
                    <button
                        className="transform transition-transform duration-500 hover:rotate-90"
                        onClick={handleNope}
                    >
                        <Image
                            src={BadIcon}
                            width={80}
                            height={80}
                            alt="싫어요"
                        />
                    </button>
                    <button
                        className="animate-pulse animate-twice animate-ease-in-out"
                        onClick={handleLike}
                    >
                        <Image
                            src={WhiteHeartIcon}
                            width={80}
                            height={80}
                            alt="좋아요"
                        />
                    </button>
                </div>
        </div>
    </div>
  )
}

export default OtherUserProfile