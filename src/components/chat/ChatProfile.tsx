'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import useSWR from 'swr';
import { ChatData } from '@/types/chat';
import UseChat, { CURRENT_CHAT_KEY } from '@/hooks/useChat';
import UserSkeleton from '../common/UserSkeleton';
import Home from '../../../public/profileIcon/Home.svg';
import ReportIcon from '../../../public/profileIcon/Report.svg';
import ChatAPI from '@/features/chat';
import { calculateAge } from '@/utils/dateUtils';
import toast from 'react-hot-toast';
import ReportModal from '../common/ReportModal';

function ChatProfile() {
    const { data: chat } = useSWR<ChatData>(CURRENT_CHAT_KEY);
    const { clearCurrentChat } = UseChat();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isReportModalVisible, setReportModalVisible] = useState(false);

    const cancelMatch = async () => {
        if (!chat) return;
        try {
            const response = await ChatAPI.deleteChat(chat?.chatRoomId);
            if (response.status === 200) {
                clearCurrentChat();
                toast.success(response.data.message);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full p-4">
            <ReportModal
                isOpen={isReportModalVisible}
                onClose={() => setReportModalVisible(false)}
                userId={chat?.userId}
            />
            {chat ? (
                <>
                    <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-5">
                        <Image
                            src={chat.image}
                            alt="Picture of the author"
                            width={231}
                            height={231}
                            priority
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-[31px]">
                        {chat && (
                            <div>
                                <p className="text-3xl font-semibold">
                                    {chat.nickname},{' '}
                                    {calculateAge(chat.birthday)}
                                </p>
                            </div>
                        )}
                        <div className="mt-[33px] px-4 py-1 h-[142px] w-[300px] flex flex-col gap-3 bg-neutral-100 rounded-2xl justify-center">
                            {!chat.location ? (
                                <p className="text-center">
                                    작성된 내용이 없습니다.
                                </p>
                            ) : (
                                <>
                                    {chat.location ? (
                                        <div className="flex items-center gap-4">
                                            <Home />
                                            {chat.location}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-[15px]">
                            {chat.mbti && (
                                <div className="text-fuchsia-400 text-xl border border-fuchsia-400 rounded-2xl px-2 py-1">
                                    #{chat.mbti}
                                </div>
                            )}
                            {chat.religion && (
                                <div className="border border-fuchsia-400 text-fuchsia-400 text-xl rounded-2xl px-2 py-1">
                                    {chat.religion === 'NONE'
                                        ? '종교 없음'
                                        : `#${chat.religion}`}
                                </div>
                            )}
                        </div>
                        <div
                            className="flex items-center justify-center w-28 h-7 p-2.5 bg-neutral-100 rounded-3xl shadow mt-[5px] cursor-pointer"
                            onClick={() => setReportModalVisible(true)}
                        >
                            <div className="flex items-center justify-center gap-2 text-neutral-400 text-base font-semibold">
                                <div>
                                    <ReportIcon />
                                </div>
                                <div>신고하기</div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mx-auto flex justify-center items-center w-[207px] bg-rose-100 rounded-full h-[45px] mt-10 hover:scale-110 transition-all duration-200"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <button className="text-red-600 text-xl">
                            채팅방 나가기
                        </button>
                    </div>
                    {showLogoutModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            {/* 모달 외부 배경 (그레이 오버레이) */}
                            <div
                                className="absolute inset-0 bg-gray-500 opacity-50"
                                onClick={() => setShowLogoutModal(false)}
                            ></div>

                            {/* 모달 창 */}
                            <div className="bg-white p-2 rounded-xl shadow-lg w-[400px] z-10 h-[320px] flex flex-col items-center justify-center">
                                <div className="font-bold text-2xl mb-10">
                                    ⚠️ 채팅방을 나가시겠습니까?
                                </div>
                                <div className="text-gray-500">
                                    채팅방을 나가면 대화내용이 모두 삭제되고
                                    <br /> 채팅목록에서도 사라집니다.
                                </div>
                                <div className="flex justify-between mt-6 w-full px-10">
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
                                            cancelMatch();
                                            setShowLogoutModal(false);
                                        }}
                                        className="px-4 py-2rounded-lg transition-all hover:scale-125"
                                    >
                                        나가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <UserSkeleton />
                </>
            )}
        </div>
    );
}

export default ChatProfile;
