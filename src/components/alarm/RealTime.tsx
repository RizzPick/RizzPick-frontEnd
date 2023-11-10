// ? EventSource.onopen : 서버와 연결이 open되었을 때 호출하는 이벤트 핸들러
// ? EventSource.onmessage : 서버로부터 message를 수신했을 때 호출하는 이벤트 핸들러
// ? EventSource.onerror : 에러가 발생하거나 EventSource 객체에서 error event가 감지되었을 때 호출하는 이벤트 핸들러

'use client';
import React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getCookie } from '@/utils/cookie';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { toast } from 'react-hot-toast';

type Alert = {
    id: number;
    receiver: { id: number };
    sender: { id: number };
    message: string;
    content: string;
    url: string;
    readStatus: boolean;
};

const RealTime = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [shownAlertsIds, setShownAlertsIds] = useState<Set<number>>(
        new Set()
    );
    const token = getCookie('Authorization');
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const [sse, setSse] = useState<EventSourcePolyfill | null>(null);
    const [processedEventIds, setProcessedEventIds] = useState<string[]>([]);
    const sseRef = useRef<EventSourcePolyfill | null>(null);

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

    // useEffect(() => {
    //     showToast('실시간 버튼을 클릭해서 좋아요, 매칭 현황을 확인해보세요!');
    // }, [token]);

    const handleNewMessage = useCallback(
        (event: any) => {
            if (event.data.startsWith('{')) {
                const newAlert: Alert = JSON.parse(event.data);
                const eventId = event.lastEventId; // 이벤트 ID 가져오기

                // 이벤트 ID가 이미 처리되었는지 확인
                if (!processedEventIds.includes(eventId)) {
                    // 이벤트 ID를 처리 목록에 추가
                    setProcessedEventIds((prevIds) => [...prevIds, eventId]);

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
            }
        },
        [showToast, processedEventIds]
    );

    useEffect(() => {
        if (!token || sseRef.current) return;

        console.log('Initializing SSE connection...');
        const initializeSSE = () => {
            const sse = new EventSource('https://willyouback.shop/subscribe', {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'text/event-stream',
                    Connection: 'keep-alive',
                    'Cache-Control': 'no-cache',
                },
                heartbeatTimeout: 3600000, // 1시간 타임아웃 설정
            });

            sse.onopen = () => {
                console.log('SSE 연결됨');
                fetchAlerts();
            };

            sse.onmessage = (event: any) => {
                console.log('알림 메시지 전달받음');
                console.log(event);
                console.log(event.data);
                handleNewMessage(event);
            };

            sse.onerror = (e) => {
                console.error('EventSource error:', e);
                // 에러 발생 시 재연결 로직이 있다면 여기에 넣기
                sse.close();
                sseRef.current = null;
            };

            sseRef.current = sse;
        };
        initializeSSE();

        return () => {
            if (sseRef.current) {
                console.log('Closing SSE connection...');
                sseRef.current.close();
                sseRef.current = null;
            }
        };
    }, [token, handleNewMessage]); // 의존성 배열에 token과 handleNewMessage 포함

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
            setAlerts((currentAlerts) => {
                const newAlerts = data.data.filter(
                    (newAlert: Alert) => !newAlert.readStatus
                );
                // 여기서 newAlerts는 아직 표시되지 않은 새 알림들입니다.
                // 이미 표시된 알림을 제외하고 새로운 알림만 반환합니다.
                return [...currentAlerts, ...newAlerts];
            });
        } catch (error) {
            console.error('Fetching alerts failed:', error);
        }
    }, [token]);

    return null;
};

export default React.memo(RealTime);

// const reconnectSSE = useCallback(
//     (retries = 3, delay = 5000) => {
//         if (sse) return; // 이미 연결이 있는 경우 재연결 시도를 하지 않습니다.

//         setTimeout(() => {
//             if (retries > 0) {
//                 console.log(`재연결 시도 중... 남은 시도 횟수: ${retries}`);
//                 initializeSSE();
//             }
//         }, delay);
//     },
//     [sse, initializeSSE]
// );

// useEffect(() => {
//     if (!sse) {
//         initializeSSE();
//     }
//     return () => {
//         if (sse) {
//             sse.close();
//             setSse(null);
//         }
//     };
// }, []);

// const updateReadStatus = useCallback(
//     async (alertId: number) => {
//         try {
//             await fetch(`https://willyouback.shop/alerts/${alertId}/read`, {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `${token}`,
//                 },
//             });
//             // 성공적으로 readStatus가 업데이트 되었다면, 여기에 로직 추가
//         } catch (error) {
//             console.error('Updating read status failed:', error);
//         }
//     },
//     [token]
// );

// 새로운 알림이 추가될 때마다 토스트를 띄우는 useEffect
// useEffect(() => {
//     if (alerts.length > 0) {
//         const lastAlert = alerts[alerts.length - 1];
//         showToast(lastAlert.message);
//     }
// }, [alerts, showToast]);
