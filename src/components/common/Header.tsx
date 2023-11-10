'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserInfo } from '@/types/user';
import { useEffect, useState, useCallback } from 'react';
import AuthAPI from '@/features/auth';
import { getCookie } from '@/utils/cookie';
import Alarm from '@/components/alarm/Alarm';
import Logo from '../../../public/RizzPick_color.png';
import RealTimeModal from '../alarm/RealTimeModal';
import { Dispatch, SetStateAction } from 'react';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

type Alert = {
    id: number;
    receiver: { id: number };
    sender: { id: number };
    message: string;
    content: string;
    url: string;
    time: string;
    readStatus: boolean;
};

export default function Header() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [openChatModal, setOpenChatModal] = useState(false);
    const [showRealTimeModal, setShowRealTimeModal] = useState(false);
    const token = getCookie('Authorization');
    const [userInfo, setUserInfo] = useState<UserInfo>();

    const [unreadAlertCount, setUnreadAlertCount] = useState(0);

    const [closeModal] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [messages, setMessages] = useState<string[]>([]);

    const EventSource = EventSourcePolyfill || NativeEventSource;
    const [sse, setSse] = useState<EventSourcePolyfill | null>(null);

    const Open = () => {
        setShowOverlay(true);
        setOpenChatModal(true);
    };

    const close = () => {
        setShowOverlay(false);
        setOpenChatModal(false);
    };

    const openRealTimeModal = () => {
        setShowOverlay(true);
        setShowRealTimeModal(true);
    };

    const closeRealTimeModal = () => {
        setShowOverlay(false);
        setShowRealTimeModal(false);
    };

    const handleNewAlert = useCallback(
        (newAlert: string) => {
            // 새로운 알림 메시지를 화면에 표시
            setMessages((currentMessages) => [...currentMessages, newAlert]);
        },
        [setMessages]
    );

    const fetchAlerts = useCallback(async () => {
        try {
            const response = await fetch('https://willyouback.shop/alerts', {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAlerts(data.data); // 모든 알림 데이터를 저장

            // 여기서 unreadAlertCount를 업데이트합니다.
            setUnreadAlertCount(
                data.data.filter((alert: any) => !alert.readStatus).length
            );
        } catch (error) {
            console.error('Fetching alerts failed:', error);
        }
    }, [token]);

    const initializeSSE = useCallback(() => {
        const newSSE = new EventSource('https://willyouback.shop/subscribe', {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache',
            },
            heartbeatTimeout: 3600000,
        });

        newSSE.onopen = () => {
            console.log('SSE 연결됨');
            fetchAlerts();
        };

        newSSE.onmessage = (event) => {
            fetchAlerts();
            console.log('알림 메시지 전달받음');
            console.log(event);
            console.log(event.data);

            // 데이터를 JSON으로 파싱
            try {
                if (event.data.startsWith('{')) {
                    const jsonData = JSON.parse(event.data);
                    if (Array.isArray(jsonData)) {
                        // 데이터가 배열로 온 경우, 각 메시지를 처리
                        jsonData.forEach((newAlert) => {
                            if (newAlert && newAlert.message) {
                                handleNewAlert(newAlert.message);
                            }
                        });
                    } else if (jsonData && jsonData.message) {
                        // 데이터가 개별 메시지인 경우, 해당 메시지를 처리
                        handleNewAlert(jsonData.message);
                    }
                }
            } catch (error) {
                console.error('Parsing JSON failed:', error);
            }
        };

        newSSE.onerror = (e) => {
            console.error('EventSource error:', e);
            newSSE.close();
        };

        setSse(newSSE);
    }, [token, handleNewAlert]);

    useEffect(() => {
        setUnreadAlertCount(alerts.filter((alert) => !alert.readStatus).length);
    }, [alerts]);

    // 컴포넌트가 마운트될 때 EventSource 초기화
    useEffect(() => {
        initializeSSE();
        fetchAlerts();
        return () => {
            sse?.close();
        };
    }, [initializeSSE]);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await AuthAPI.getUserInfo();
                    setUserInfo(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchData();
        }
    }, [token]);

    return (
        <header className="flex justify-between item-center px-8 sm:px-4 py-4 border-b border-zinc-300 sm:border-none">
            <nav className="flex items-center text-2xl gap-12">
                <Link
                    href="/user/match"
                    onClick={() =>
                        sessionStorage.setItem('selectedIcon', 'home')
                    }
                >
                    <div className="relative w-[71px] h-[45px]">
                        <Image
                            src={Logo}
                            priority
                            alt="로고"
                            fill={true}
                            sizes="(max-width: 393px) 71px, (max-width: 1200px) 30vw, 350px"
                            object-fit="cover"
                        />
                    </div>
                </Link>
                <Link href="/user/plan/board" className="sm:hidden">
                    데이트
                </Link>
            </nav>
            <nav className="flex gap-12 items-center sm:hidden text-2xl">
                <span onClick={openRealTimeModal} className="cursor-pointer">
                    실시간
                </span>
                {unreadAlertCount > 0 && (
                    <span className="mb-6 ml-[-45px] px-1 text-xs border rounded-full bg-[red] text-white">
                        {unreadAlertCount}
                    </span>
                )}
                {showRealTimeModal && (
                    <RealTimeModal
                        close={closeRealTimeModal}
                        setUnreadAlertCount={setUnreadAlertCount}
                    />
                )}
                <span onClick={Open} className="cursor-pointer">
                    알림
                </span>
                {openChatModal && <Alarm close={close} />}
                {showOverlay && (
                    <div
                        className="block fixed top-0 left-1/2 transform -translate-x-1/2 h-full z-30 w-full bg-stone-300 bg-opacity-40"
                        onClick={() => {
                            close();
                            closeRealTimeModal(); // 모달 외부 클릭 시 실시간 모달도 함께 닫히도록 설정
                        }}
                    ></div>
                )}
                {/* 다른 페이지에서 넘어갈때 404 나와서 경로 수정 필요 */}
                {userInfo && (
                    <>
                        <Link href="/profile">
                            <div>프로필</div>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
