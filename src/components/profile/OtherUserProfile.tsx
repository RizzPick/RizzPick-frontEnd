'use client'
import { MyProfileRes } from '@/types/profile'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Back from "../../../public/chatIcon/Button.svg"
import Image from 'next/image'
import Home from "../../../public/profileIcon/Home.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import WhiteHeartIcon from '../../../public/matchIcon/Like.png';
import BadIcon from '../../../public/matchIcon/Nope.png';
import axios from 'axios'
import { getCookie } from '@/utils/cookie'
import toast from 'react-hot-toast'
import UseChat from '@/hooks/useChat'
import ChatAPI from '@/features/chat'
import { calculateAge } from '@/utils/dateUtils'

type Props = {
    profile : MyProfileRes
}

function OtherUserProfile({profile} : Props) {
    const router = useRouter();

    const {clearCurrentChat} = UseChat()
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const cancelMatch = async() => {
    if(!profile.matchId) return;
    try {
      const response = await ChatAPI.deleteChat(profile.matchId);
      if(response.status === 200) {
        clearCurrentChat();
        toast.success('매칭이 취소되었습니다');
        router.push('/user/match')
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        <div className='flex items-center justify-center mt-[33px] text-zinc-800 text-2xl'>{profile.nickname}, {calculateAge(profile.birthday)}</div>
        <div className='p-4'>
            <div className='mt-[33px] px-4 py-2 h-[150px] gap-1 flex flex-col bg-neutral-100 rounded-2xl justify-center'>
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
            {!profile.matchId && 
            <div className="text-white w-[30vw] flex justify-center items-center mx-auto sm:gap-10 mt-6 gap-80">
                    <button
                        className="transform transition-transform duration-500 hover:rotate-90"
                        onClick={handleNope}
                    >
                        <Image
                            src={BadIcon}
                            width={100}
                            height={100}
                            alt="싫어요"
                        />
                    </button>
                    <button
                        className="animate-pulse animate-twice animate-ease-in-out"
                        onClick={handleLike}
                    >
                        <Image
                            src={WhiteHeartIcon}
                            width={100}
                            height={100}
                            alt="좋아요"
                        />
                    </button>
                </div>
            }
            
            {profile.matchId && 
                <>
                <div className='mx-auto flex justify-center items-center w-[207px] bg-rose-100 rounded-full h-[45px] mt-10 hover:scale-110 transition-all duration-200' onClick={()=>setShowLogoutModal(true)}>
                <button className='text-red-600 text-xl'>채팅방 나가기</button>
              </div>
              {showLogoutModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                      {/* 모달 외부 배경 (그레이 오버레이) */}
                      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={() => setShowLogoutModal(false)}></div>
                      
                      {/* 모달 창 */}
                      <div className="bg-white p-2 rounded-xl shadow-lg w-[400px] z-10 h-[320px] flex flex-col items-center justify-center">
                          <div className='font-bold text-2xl mb-10'>⚠️ 채팅방을 나가시겠습니까?</div>
                          <div className='text-gray-500'>채팅방을 나가면 대화내용이 모두 삭제되고<br/> 채팅목록에서도 사라집니다.</div>
                          <div className="flex justify-between mt-6 w-full px-10">
                              <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 rounded">취소</button>
                              <button onClick={() => { cancelMatch(); setShowLogoutModal(false); }} className="px-4 py-2rounded-lg transition-all hover:scale-125">나가기</button>
                          </div>
                      </div>
                  </div>
              )}
              </>
            }
            
        </div>
    </div>
  )
}

export default OtherUserProfile