'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getCookie } from '@/utils/cookie';
import Alarm from '@/components/alarm/Alarm';
import Logo from '../../../public/RizzPick_color.png';
import RealTimeModal from '../alarm/RealTimeModal';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { toast } from 'react-hot-toast';
import { useEventSource } from '@/app/EventSourceContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Alert = {
    id: number;
    receiver: {
        id: number;
        profileImages: Array<{ id: number; image: string }>;
    };
    sender: {
        id: number;
        profileImages: Array<{ id: number; image: string }>;
    };
    message: string;
    url: string;
    time: string;
    readStatus: boolean;
};

export default function Header({ isVisible = true }) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [openChatModal, setOpenChatModal] = useState(false);
    const [showRealTimeModal, setShowRealTimeModal] = useState(false);
    const token = getCookie('Authorization');
    const router = useRouter();

    const [unreadAlertCount, setUnreadAlertCount] = useState(0);

    const [closeModal] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [processedEventIds, setProcessedEventIds] = useState<number[]>([]);
    const sseRef = useRef<EventSourcePolyfill | null>(null);

    const eventSource = useEventSource();

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

    const showToast = useCallback((message: string) => {
        (toast as any)(message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, []);

    const handleNewAlert = useCallback(
        (newAlert: string) => {
            // 새로운 알림 메시지를 화면에 표시
            setMessages((currentMessages) => [...currentMessages, newAlert]);
        },
        [setMessages]
    );

    const handleNewMessage = useCallback(
        (event: any) => {
            if (event.data.startsWith('{')) {
                try {
                    const newAlert: Alert = JSON.parse(event.data);

                    // 이벤트 ID가 이미 처리되었는지 확인
                    if (!processedEventIds.includes(newAlert.id)) {
                        // 이벤트 ID를 처리 목록에 추가
                        setProcessedEventIds((prevIds) => [
                            ...prevIds,
                            newAlert.id,
                        ]);

                        // readStatus가 false인 경우에만 새 알림을 처리
                        if (!newAlert.readStatus) {
                            setAlerts((currentAlerts) => {
                                // 이미 표시된 알림인지 확인
                                if (
                                    !currentAlerts.some(
                                        (alert) => alert.id === newAlert.id
                                    )
                                ) {
                                    showToast(newAlert.message);
                                    return [...currentAlerts, newAlert]; // 새 알림을 상태에 추가
                                } else {
                                    return currentAlerts; // 이미 있는 알림이면 상태를 변경하지 않음
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        },
        [showToast, processedEventIds]
    );

    const fetchAlerts = useCallback(async () => {
        if (!isVisible || sseRef.current) return;

        try {
            const response = await axios.get(
                'https://willyouback.shop/alerts',
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setAlerts((currentAlerts) => {
                    const newAlerts = response.data.data.filter(
                        (newAlert: Alert) =>
                            !currentAlerts.some(
                                (alert) => alert.id === newAlert.id
                            )
                    );
                    return [...currentAlerts, ...newAlerts];
                });
                setUnreadAlertCount(
                    response.data.data.filter(
                        (alert: Alert) => !alert.readStatus
                    ).length
                );
            }
        } catch (error) {
            console.error('Fetching alerts failed:', error);
        }
    }, [token, isVisible]);

    useEffect(() => {
        fetchAlerts(); // 컴포넌트 마운트 시 초기 데이터 로드
    }, [fetchAlerts]);

    useEffect(() => {
        if (!eventSource) return;
        const onMessage = (event: any) => {
            // console.log('Received a message:', event.data); // 여기에서 로깅
            handleNewMessage(event);
            fetchAlerts();
            try {
                const data = JSON.parse(event.data);

                // console.log('Parsed data:', data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            fetchAlerts();
            // console.log('알림 메시지 전달받음');
            // console.log(event);
            // console.log(event.data);
            handleNewMessage(event);
            // 데이터를 JSON으로 파싱
            try {
                if (event.data.startsWith('{')) {
                    const jsonData = JSON.parse(event.data);
                    // console.log(jsonData);
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

        // 에러 이벤트 핸들러
        const onError = (error: any) => {
            // 여기서 에러 처리
            console.error('EventSource error:', error);
        };

        eventSource.addEventListener('message', onMessage);
        return () => {
            if (eventSource) {
                eventSource.removeEventListener('message', onMessage);
            }
        };
    }, [eventSource, fetchAlerts, handleNewAlert, handleNewMessage]);

    useEffect(() => {
        setUnreadAlertCount(alerts.filter((alert) => !alert.readStatus).length);
    }, [alerts]);

    // 컴포넌트가 마운트될 때 EventSource 초기화
    // useEffect(() => {
    //     initializeSSE();
    //     fetchAlerts();
    //     return () => {
    //         sse?.close();
    //     };
    // }, [initializeSSE]);

    // useEffect(() => {
    //     if (!isVisible) return;

    //     // isVisible이 true일 때만 EventSource를 초기화
    //     initializeSSE();
    //     fetchAlerts();

    //     // 컴포넌트가 언마운트 될 때 실행될 클린업 함수
    //     return () => {
    //         sse?.close();
    //     };
    // }, [isVisible, initializeSSE]);

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
                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 350px"
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
                <span
                    className="cursor-pointer"
                    onClick={() => router.push('/user/chat')}
                >
                    채팅
                </span>
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
                <>
                    <Link href="/profile">
                        <div>프로필</div>
                    </Link>
                </>
            </nav>
        </header>
    );
}
