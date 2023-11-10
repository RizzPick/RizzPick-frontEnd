'use client'
import { MyProfileRes } from '@/types/profile'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Back from "../../../public/chatIcon/Button.svg"
import Image from 'next/image'
import Home from "../../../public/profileIcon/Home.svg"
import ReportIcon from "../../../public/profileIcon/Report.svg";
import toast from 'react-hot-toast'
import UseChat from '@/hooks/useChat'
import ChatAPI from '@/features/chat'
import { calculateAge } from '@/utils/dateUtils'
import ReportModal from '../common/ReportModal'
import MatchControls from '../match/MatchControls'
import { MatchAPI } from '@/features/match'

type Props = {
    profile : MyProfileRes
}

function OtherUserProfileMobile({profile} : Props) {
    const router = useRouter();
    const {clearCurrentChat} = UseChat()
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isReportModalVisible, setReportModalVisible] = useState(false);

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


const handleUserReaction = async (reaction: 'like' | 'nope') => {
    try {
        const userId = profile.userId;
        const response = await (reaction === 'like' ? MatchAPI.sendLike(userId) : MatchAPI.sendNope(userId));

        if (response.status === 200) {
            toast(response.data.message, { icon: reaction === 'like' ? '❤️' : '👎', });
        }
    } catch (error) {
        console.error(reaction === 'like' ? '좋아요 보내기 오류:' : '싫어요 보내기 오류:', error);
    }
};

  return (
    <div className='w-full h-[100vh]'>
        <ReportModal
                    isOpen={isReportModalVisible}
                    onClose={() => setReportModalVisible(false)}
                    userId={profile?.userId}
        />
        <header className='text-center text-neutral-700 text-xl font-medium leading-tight tracking-wide flex justify-center p-4'>
            <button className='absolute left-[15px]' onClick={()=>router.back()}><Back/></button>
            <h1>{profile.nickname}</h1>
        </header>
        <div className='relative w-[187px] h-[187px] mx-auto mt-[20px]'>
            <Image src={profile.profileImages[0].image} alt='프로필 이미지' fill className='rounded-full' style={{objectFit:"cover"}} priority />
        </div>
        <div className='flex items-center justify-center mt-[15px] text-zinc-800 text-2xl'>{profile.nickname}, {calculateAge(profile.birthday)}</div>
        <div className='flex flex-col w-full items-center px-2'>
            <div className='mt-[20px] p-4 w-full h-[170px] flex flex-col bg-neutral-100 rounded-2xl justify-center'>
                    {!profile.location && !profile.mbti && !profile.religion ? 
                        <p className="text-center">작성된 내용이 없습니다.</p> 
                        : 
                        <>
                            { profile.location ? <div className='flex items-center gap-4 border-b py-2'><Home/>{profile.location}</div> : null }
                            <div className='flex items-center gap-4 border-b py-2'>
                                { profile.mbti ? <div className='px-3 py-1 border border-fuchsia-400 text-fuchsia-400 rounded-3xl'>#{profile.mbti}</div> : null }
                                { profile.religion ? <div className='px-3 py-1 border border-fuchsia-400 text-fuchsia-400 rounded-3xl'>#{profile.religion}</div> : null }
                            </div>
                            <div className='flex items-center gap-4 py-2'>
                            { profile.hobby ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{profile.hobby}</div> : null }
                            { profile.interest ? <div className='px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400'>#{profile.interest}</div> : null }
                            </div>
                        </>
                    }
            </div>
            <div className='flex items-center justify-center w-28 h-7 p-2.5 bg-neutral-100 rounded-3xl shadow mt-[20px] cursor-pointer' onClick={() => setReportModalVisible(true)}>
              <div className='flex items-center justify-center gap-2 text-neutral-400 text-base font-semibold'>
                <div>
                  <ReportIcon/>
                </div>
                <div>
                  신고하기
                </div>
              </div>
            </div>
            {/* 좋아요, 싫어요 버튼 */}
            {!profile.matchId && 
                <MatchControls onReaction={handleUserReaction} />
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

export default OtherUserProfileMobile