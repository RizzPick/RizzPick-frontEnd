// ? EventSource.onopen : 서버와 연결이 open되었을 때 호출하는 이벤트 핸들러
// ? EventSource.onmessage : 서버로부터 message를 수신했을 때 호출하는 이벤트 핸들러
// ? EventSource.onerror : 에러가 발생하거나 EventSource 객체에서 error event가 감지되었을 때 호출하는 이벤트 핸들러

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getCookie } from '@/utils/cookie';
import Alarm from '@/components/alarm/Alarm';
import Logo from '../../../public/RizzPick_color.png';
import RealTimeModal from '../alarm/RealTimeModal';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { toast } from 'react-hot-toast';
import { useEventSource } from '@/app/EventSourceContext';
import { useRouter } from 'next/navigation';

// interface ProfileImage {
//     id: number;
//     image: string;
// }

// interface User {
//     id: number;
//     profileImages: ProfileImage[];
// }

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

// interface ExtendedEventSourcePolyfill extends EventSourcePolyfill {
//     lastConnectionTime?: number;
// }

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

    // const EventSource = EventSourcePolyfill || NativeEventSource;
    // const [sse, setSse] = useState<EventSourcePolyfill | null>(null);
    // const [shownAlertsIds, setShownAlertsIds] = useState<Set<number>>(
    //     new Set()
    // );
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

            setAlerts((currentAlerts) => {
                // 새로운 알림들만 필터링
                const newAlerts = data.data.filter(
                    (newAlert: Alert) =>
                        !currentAlerts.some((alert) => alert.id === newAlert.id)
                );

                // 현재 알림 목록에 새 알림들을 추가
                return [...currentAlerts, ...newAlerts];
            });

            // 아직 읽지 않은 알림의 수를 업데이트
            setUnreadAlertCount(
                data.data.filter((alert: Alert) => !alert.readStatus).length
            );
        } catch (error) {
            console.error('Fetching alerts failed:', error);
        }
    }, [token, isVisible]);

    useEffect(() => {
        if (!eventSource) return;

        // 메시지 이벤트 핸들러
        const onMessage = (event: any) => {
            console.log('Received a message:', event.data); // 여기에서 로깅
            try {
                const data = JSON.parse(event.data);
                console.log('Parsed data:', data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            fetchAlerts();
            console.log('알림 메시지 전달받음');
            console.log(event);
            console.log(event.data);
            handleNewMessage(event);
            // 데이터를 JSON으로 파싱
            try {
                if (event.data.startsWith('{')) {
                    const jsonData = JSON.parse(event.data);
                    console.log(jsonData);
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
        eventSource.addEventListener('error', onError);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 EventSource 닫기
        return () => {
            eventSource.removeEventListener('message', onMessage);
            eventSource.removeEventListener('error', onError);
        };
    }, [eventSource]);

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
                <span className="cursor-pointer" onClick={()=>router.push('/user/chat')}>
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

// const initializeSSE = useCallback(() => {
//     const currentSSE = sseRef.current;
//     if (
//         currentSSE &&
//         Date.now() - currentSSE.lastConnectionTime! < 3600000
//     ) {
//         console.log(
//             '1시간이 지나지 않았으므로 SSE 재연결을 시도하지 않음.'
//         );
//         return;
//     }

//     const newSSE: EventSourcePolyfill & { lastConnectionTime?: number } =
//         new EventSourcePolyfill('https://willyouback.shop/subscribe', {
//             headers: {
//                 Authorization: `${token}`,
//                 'Content-Type': 'text/event-stream',
//                 Connection: 'keep-alive',
//                 'Cache-Control': 'no-cache',
//             },
//             heartbeatTimeout: 3600000,
//         }) as EventSourcePolyfill & { lastConnectionTime: number };

//     newSSE.onopen = () => {
//         console.log('SSE 연결됨');
//         fetchAlerts();
//         newSSE.lastConnectionTime = Date.now();
//     };

//     newSSE.onmessage = (event) => {
//         console.log('Received a message:', event.data); // 여기에서 로깅
//         try {
//             const data = JSON.parse(event.data);
//             console.log('Parsed data:', data);
//         } catch (error) {
//             console.error('Error parsing JSON:', error);
//         }
//         fetchAlerts();
//         console.log('알림 메시지 전달받음');
//         console.log(event);
//         console.log(event.data);
//         handleNewMessage(event);
//         // 데이터를 JSON으로 파싱
//         try {
//             if (event.data.startsWith('{')) {
//                 const jsonData = JSON.parse(event.data);
//                 if (Array.isArray(jsonData)) {
//                     // 데이터가 배열로 온 경우, 각 메시지를 처리
//                     jsonData.forEach((newAlert) => {
//                         if (newAlert && newAlert.message) {
//                             handleNewAlert(newAlert.message);
//                         }
//                     });
//                 } else if (jsonData && jsonData.message) {
//                     // 데이터가 개별 메시지인 경우, 해당 메시지를 처리
//                     handleNewAlert(jsonData.message);
//                 }
//             }
//         } catch (error) {
//             console.error('Parsing JSON failed:', error);
//         }
//     };

//     newSSE.onerror = (e) => {
//         newSSE.close();
//     };

//     sseRef.current = newSSE;

//     setSse(newSSE);
// }, [token, handleNewAlert]);
