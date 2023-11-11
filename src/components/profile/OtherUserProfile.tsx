'use client'
import { MyProfileRes } from '@/types/profile'
import { calculateAge } from '@/utils/dateUtils'
import React, { useState } from 'react'
import Image from 'next/image'
import { GoDotFill } from 'react-icons/go'
import LeftButton from '../../../public/matchIcon/left.svg';
import RightButton from '../../../public/matchIcon/right.svg';
import LikeIcon from '../../../public/matchIcon/Like.png';
import NopeIcon from '../../../public/matchIcon/Nope.png';
import ReportIcon from "../../../public/profileIcon/Report.svg";
import HomeIcon from "../../../public/profileIcon/Home.svg";
import { MatchAPI } from '@/features/match'
import toast from 'react-hot-toast'
import ReportModal from '../common/ReportModal'
import { useRouter } from 'next/navigation'
import UserLayout from '@/app/user/layout'

type Props = {
    profile : MyProfileRes
}

function OtherUserProfile({profile} : Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const router = useRouter();

    const nextSlide = () => {
        if (!profile) return; 
        setSlideIndex(
            (prevIndex) => (prevIndex + 1) % profile.profileImages.length
        );
    };

    const prevSlide = () => {
        if (!profile) return; 
        setSlideIndex(
            (prevIndex) =>
                (prevIndex - 1 + profile.profileImages.length) %
                profile.profileImages.length
        );
    };

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

      const handleLikeClick = () => {
        handleUserReaction('like');
    };

    // 싫어요 버튼 클릭 핸들러
    const handleNopeClick = () => {
      handleUserReaction('nope');
    };


  return (
    <UserLayout showHeader={true}>
    <div>
        <div className='h-full bg-profile-gradient p-4'>
        <ReportModal
                    isOpen={isReportModalVisible}
                    onClose={() => setReportModalVisible(false)}
                    userId={profile?.userId}
        />
          <div className='bg-likelist-gradient rounded-3xl w-[810px] flex flex-col mx-auto h-[100vh]'>
            <div className='flex items-center justify-center py-4 relative'>
              <button
                  className="absolute left-[15px] w-4"
                  onClick={() => router.back()}
              >
                  <LeftButton />
              </button>
              <h1 className='text-white text-3xl'>{profile.nickname},&nbsp;{calculateAge(profile.birthday)}</h1>
            </div>

            <div className='h-full bg-white rounded-3xl p-8'>
                <article className='flex w-full gap-6'>
                  <div className='w-[50vw] overflow-hidden relative'>
                    <div className="relative h-[353px] w-full rounded-2xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-300 via-neutral-400 to-black rounded-[20px] z-10 opacity-20"/>
                          <div className="flex justify-center mt-4">
                              {profile 
                                  ? profile.profileImages.map((_, index) => (
                                      <div key={index} className={`mx-1 z-10 text-2xl ${index === slideIndex ? ('text-white'):('text-gray-500')}`}>
                                          <GoDotFill />
                                      </div>
                                  ))
                                  : null}
                          </div>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                            >
                                <LeftButton />
                            </button>

                            {profile
                                ? profile.profileImages.map(
                                    (imageObj, index) => (
                                        <div
                                            className={
                                                index === slideIndex
                                                    ? 'slide active'
                                                    : 'slide'
                                            }
                                            key={index}
                                        >
                                            {index === slideIndex && (
                                                <Image
                                                    src={imageObj.image}
                                                    alt="User"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="absolute"
                                                    priority
                                                />
                                            )}
                                        </div>
                                    )
                                )
                                : null}

                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 m-2 hover:scale-125 transition-all duration-200 ease-in-out"
                            >
                                <RightButton />
                            </button>
                          </div>
                          <div className="mt-5 w-[30vw]flex flex-col z-40 bg-white items-start border rounded-3xl p-4 shadow-md cursor-pointer h-[110px]">
                                <div className="text-2xl flex items-center justify-between w-full">
                                        <div className='flex items-center gap-2'>
                                            <div className='font-bold text-3xl'>{profile?.nickname ??
                                                'Unknown'}</div>
                                            <div className='text-xl'>{calculateAge(profile?.birthday) ?? 'Unknown'}</div>
                                        </div>
                                </div>
                                <div className="mt-2">{profile?.intro}</div>
                            </div>
                            <div className="flex justify-evenly z-20 mt-3">
                              <button onClick={handleNopeClick} className='transform transition-transform duration-500 hover:rotate-90'>
                                <Image src={NopeIcon} alt="Nope" width={60} height={60} />
                              </button>
                              <button onClick={handleLikeClick} className='animate-pulse animate-twice animate-ease-in-out'>
                                <Image src={LikeIcon} alt="Like" width={60} height={60} />
                              </button>
                            </div>
                          </div>

                  {/* 인적사항 영역 */}
                  <div className='w-[50vw]'>
                  <div
                    className="flex-1 relative"
                  >
                        <div className="px-4 bg-white rounded-3xl h-full w-full flex flex-col justify-center relative border border-neutral-400">
                            {!profile.location &&
                            !profile.mbti &&
                            !profile.religion ? (
                                <p className="text-center">
                                    작성된 내용이 없습니다.
                                </p>
                            ) : (
                                <>
                                    {profile.location ? (
                                        <div className="flex items-center gap-4 border-b py-2">
                                            <HomeIcon />
                                            {profile.location}
                                        </div>
                                    ) : null}
                                    <div className="flex flex-col">
                                    {profile.mbti || profile.religion ? (
                                        <div className='flex gap-4 border-b py-2'>
                                        {profile.mbti ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{profile.mbti}
                                            </div>
                                        ) : null}
                                        {profile.religion ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{profile.religion}
                                            </div>
                                        ) : null}
                                        </div>
                                    ): null }
                                        
                                        <div className='flex gap-4 py-2'>
                                        {profile.hobby ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{profile.hobby}
                                            </div>
                                        ) : null}
                                        {profile.interest ? (
                                            <div className="px-3 py-1 border-fuchsia-400 border-2 rounded-3xl text-fuchsia-400">
                                                #{profile.interest}
                                            </div>
                                        ) : null}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="border p-4 bg-matchpage-date-gradient rounded-3xl border-neutral-400 mt-4">
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            나랑 이런 데이트 어때요?
                        </h2>
                        <div className="h-[250px] border bg-white mx-auto rounded-3xl p-4 flex items-center justify-center border-neutral-800">
                            {profile &&
                            profile.dating &&
                            profile.dating.length > 1 ? (
                                <ul className="list-disc pl-5 space-y-2">
                                    {profile.dating?.map((date) => {
                                        return (
                                            <li key={date.datingId}>
                                                {date.datingTitle}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="mx-auto px-4 py-2 mt-4 rounded-3xl font-bold">
                                    작성한 계획이 없습니다
                                </div>
                            )}
                        </div>
                      </div>
                      <div className='flex items-center mx-auto justify-center w-28 h-7 p-2.5 bg-neutral-100 rounded-3xl shadow mt-[20px] cursor-pointer' onClick={() => setReportModalVisible(true)}>
                          <div className='flex items-center justify-center gap-2 text-neutral-400 text-base font-semibold'>
                            <div>
                              <ReportIcon/>
                            </div>
                            <div>
                              신고하기
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </article>
            </div>
          </div>
      </div>
  </div>
  </UserLayout>
  )
}

export default OtherUserProfile