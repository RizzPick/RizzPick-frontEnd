'use client';
import { MyProfileRes } from '@/types/profile';
import Image from 'next/image';
import React, {useState } from 'react';
import Home from '../../../public/profileIcon/Home.svg';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateAge } from '@/utils/dateUtils';

type Props = {
    profile : MyProfileRes;
}

function UserProfileMobile({profile} : Props) {
    const params = useSearchParams();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showResignModal, setResignModal] = useState(false);
    const router = useRouter();
    const { logout, deActiveUser } = useAuth();

    return (
        <div>
            <div className="h-[calc(100vh-20px)] bg-profile-gradient rounded-3xl p-4 relative mt-20 w-full flex justify-center">
                <div className="absolute -top-0 -mt-20">
                    {/* 유저 이미지 태그 */}
                    <div className="relative h-[146px] w-[146px]">
                        {profile && (
                            <Image
                                src={profile?.profileImages[0].image}
                                alt="프로필 이미지"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-full"
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col mt-16 w-full items-center">
                    <div className="text-zinc-800 text-2xl font-semibold">
                        {profile.nickname}, {calculateAge(profile.birthday)}
                    </div>
                    <div className="px-4 bg-white h-[180px] w-full mt-10 rounded-2xl flex flex-col justify-center">
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
                                        <Home />
                                        {profile.location}
                                    </div>
                                ) : null}
                                <div className="flex items-center gap-4 border-b py-2">
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
                                <div className="flex items-center gap-4 py-2">
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
                            </>
                        )}
                    </div>
                    <Link href={'/profile/edit'}>
                        <button className="mx-auto px-4 py-2 bg-[#D67dff] mt-4 w-20 rounded-3xl text-white font-bold hover:bg-pink-300">
                            수정
                        </button>
                    </Link>
                    <div className="mt-4 w-full rounded-2xl bg-white p-6 h-20 flex flex-col items-start justify-center text-gray-400 gap-1">
                        <p
                            className="cursor-pointer"
                            onClick={() =>
                                router.push('profile/viewChangePasswd')
                            }
                        >
                            비밀번호 변경
                        </p>
                        <hr className="w-full" />
                        <p
                            onClick={() => setShowLogoutModal(true)}
                            className="cursor-pointer"
                        >
                            로그아웃
                        </p>
                    </div>

                    {showLogoutModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="absolute inset-0 bg-gray-500 opacity-50"
                                onClick={() => setShowLogoutModal(false)}
                            ></div>

                            {/* 모달 창 */}
                            <div className="bg-white p-2 rounded-xl shadow-lg w-64 z-10 h-32 flex flex-col items-center justify-center">
                                <div>로그아웃 할까요?</div>
                                <div className="flex justify-between mt-4 w-full px-6">
                                    <button
                                        onClick={() =>
                                            setShowLogoutModal(false)
                                        }
                                        className="mr-2 px-4 py-2 rounded"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowLogoutModal(false);
                                        }}
                                        className="px-4 py-2rounded-lg transition-all hover:scale-125"
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className="mt-4 w-full rounded-2xl bg-white p-6 h-10 flex flex-col items-start justify-center text-[#cb17f9] cursor-pointer"
                        onClick={() => setResignModal(true)}
                    >
                        회원탈퇴
                    </div>
                    {showResignModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            {/* 모달 외부 배경 (그레이 오버레이) */}
                            <div
                                className="absolute inset-0 bg-gray-500 opacity-50"
                                onClick={() => setShowLogoutModal(false)}
                            ></div>

                            {/* 모달 창 */}
                            <div className="bg-white p-2 rounded-xl shadow-lg w-[70vw] z-10 h-60 flex flex-col items-center justify-center">
                                <div className="text-lg font-normal mb-4">
                                    회원 탈퇴
                                </div>
                                <p className="px-8 text-stone-500 text-sm">
                                    계정을 탈퇴 시에 사용자 정보가 함께
                                    삭제되며, 삭제 후에는 다시 되돌릴 수
                                    없습니다.
                                </p>
                                <p className="mt-4 text-stone-500 text-sm">
                                    정말로 탈퇴하시겠습니까?
                                </p>
                                <div className="flex justify-between mt-4 w-full px-6">
                                    <button
                                        onClick={() => setResignModal(false)}
                                        className="mr-2 px-4 py-2 rounded"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            deActiveUser(profile.userId),
                                                setResignModal(false);
                                        }}
                                        className="px-4 py-2rounded-lg transition-all hover:scale-125 text-red-500"
                                    >
                                        탈퇴
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfileMobile;
