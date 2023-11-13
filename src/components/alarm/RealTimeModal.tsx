//? EventSource.onopen : 서버와 연결이 open되었을 때 호출하는 이벤트 핸들러
//? EventSource.onmessage : 서버로부터 message를 수신했을 때 호출하는 이벤트 핸들러
//? EventSource.onerror : 에러가 발생하거나 EventSource 객체에서 error event가 감지되었을 때 호출하는 이벤트 핸들러

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getCookie } from '@/utils/cookie';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
// import { RealTimeModalProps } from '@/types/alarm/type';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

type ProfileImage = {
    id: number;
    image: string;
};

type UserProfile = {
    id: number;
    profileImages: ProfileImage[];
};

type Alert = {
    id: number;
    receiver: UserProfile;
    sender: UserProfile;
    message: string;
    content: string;
    url: string;
    time: string;
    readStatus: boolean;
};

export interface RealTimeModalProps {
    close: () => void;
    setUnreadAlertCount: Dispatch<SetStateAction<number>>;
}

const RealTimeModal = ({ close, setUnreadAlertCount }: RealTimeModalProps) => {
    const [closeModal] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [messages, setMessages] = useState<string[]>([]);

    const token = getCookie('Authorization');
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const [sse, setSse] = useState<EventSourcePolyfill | null>(null);
    const [processedEventIds, setProcessedEventIds] = useState<string[]>([]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            // 여기서 getTime() 메소드를 사용하여 날짜가 유효한지 확인
            return 'Invalid Date';
        }

        const year = date.getFullYear(); // 올바른 메소드 사용
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 올바른 메소드 사용
        const day = date.getDate().toString().padStart(2, '0'); // 올바른 메소드 사용
        const hours = date.getHours().toString().padStart(2, '0'); // 올바른 메소드 사용
        const minutes = date.getMinutes().toString().padStart(2, '0'); // 올바른 메소드 사용

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    useEffect(() => {
        setUnreadAlertCount(alerts.filter((alert) => !alert.readStatus).length);
    }, [alerts]);

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(
                `https://willyouback.shop/alerts/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // 읽음 처리가 완료된 메시지의 readStatus를 업데이트합니다.
            setAlerts((currentAlerts) => {
                const updatedAlerts = currentAlerts.map((alert) => {
                    if (alert.id === id) {
                        alert.readStatus = true;
                    }
                    return alert;
                });
                return updatedAlerts;
            });
        } catch (error) {
            console.error('Marking alert as read failed:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // 모든 알림 메시지를 읽음 처리합니다.
            const updatedAlerts = await Promise.all(
                alerts.map(async (alert) => {
                    if (!alert.readStatus) {
                        await markAsRead(alert.id);
                        return { ...alert, readStatus: true };
                    }
                    return alert;
                })
            );

            // 화면에 업데이트된 알림 메시지를 반영합니다.
            setAlerts(updatedAlerts);
        } catch (error) {
            console.error('Marking all alerts as read failed:', error);
        }
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

            const parsedAlerts = data.data.map((alertData: any) => ({
                id: alertData.id,
                receiver: alertData.receiver,
                sender: alertData.sender,
                message: alertData.message,
                url: alertData.url,
                readStatus: alertData.readStatus,
                time: formatDate(alertData.time),
            }));

            setAlerts(parsedAlerts);
        } catch (error) {
            console.error('Fetching alerts failed:', error);
        }
    }, [token]);

    useEffect(() => {
        // 데이터베이스에서 알림 데이터를 가져오는 함수 호출
        fetchAlerts();

        // 30초마다 알림 데이터를 새로고침
        const interval = setInterval(fetchAlerts, 30000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(interval);
    }, []);

    // const initializeSSE = useCallback(() => {
    //     const newSSE = new EventSource('https://willyouback.shop/subscribe', {
    //         headers: {
    //             Authorization: `${token}`,
    //             'Content-Type': 'text/event-stream',
    //             Connection: 'keep-alive',
    //             'Cache-Control': 'no-cache',
    //         },
    //         heartbeatTimeout: 3600000,
    //     });

    //     newSSE.onopen = () => {
    //         console.log('SSE 연결됨');
    //     };

    //     newSSE.onmessage = (event) => {
    //         console.log('알림 메시지 전달받음');
    //         console.log(event);
    //         console.log(event.data);

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
    //         console.error('EventSource error:', e);
    //         newSSE.close();
    //     };

    //     setSse(newSSE);
    // }, [token, handleNewAlert]);

    useEffect(() => {
        setUnreadAlertCount(alerts.filter((alert) => !alert.readStatus).length);
    }, [alerts]);

    // // 컴포넌트가 마운트될 때 EventSource 초기화
    // useEffect(() => {
    //     initializeSSE();
    //     fetchAlerts();
    //     return () => {
    //         sse?.close();
    //     };
    // }, [initializeSSE]);

    return (
        <>
            {closeModal && (
                <div
                    className="absolute top-[100px] right-[60px] translate-[-50%] bg-white p-6 w-[400px] h-[500px] flex flex-col z-50 border border-zinc-800 rounded-3xl"
                    style={{ overflowY: 'auto', maxHeight: '90%' }}
                >
                    <div className="flex justify-between items-center border-b-2 border-[#C5C5C5] mb-2 pb-2">
                        <h1 className="text-xl font-bold">실시간 알림</h1>
                        <button onClick={markAllAsRead} className="">
                            전체 읽음
                        </button>
                    </div>
                    <ul>
                        {alerts.map((alert) => (
                            <div key={alert.id} className="">
                                {!alert.readStatus && (
                                    <div className="flex flex-row items-center py-2">
                                        {/* {alert.sender.profileImages[0] && (
                                            <Image
                                                src={
                                                    alert.sender
                                                        .profileImages[0].image
                                                }
                                                alt="Profile"
                                               
                                            />
                                        )} */}
                                        <p className="text-base">
                                            {alert.message}
                                        </p>
                                        <p className="text-[#aaa] text-xs ml-2 mr-1">
                                            {formatDate(alert.time)}
                                        </p>
                                        <button
                                            onClick={() => markAsRead(alert.id)}
                                            className="text-base text-red-500"
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default RealTimeModal;

// const reconnectSSE = useCallback((retries = 3, delay = 5000) => {
//     setTimeout(() => {
//         if (retries > 0) {
//             console.log(`재연결 시도 중... 남은 시도 횟수: ${retries}`);
//             initializeSSE();
//         }
//     }, delay);
// }, []);

// 실시간 알림을 받았을 때 처리하는 함수
// const handleNewAlert = useCallback(
//     (newAlert: string) => {
//         // 새로운 알림 메시지를 화면에 표시
//         setMessages((currentMessages) => [...currentMessages, newAlert]);
//     },
//     [setMessages]
// );

// const initializeSSE = useCallback(() => {
//     const newSSE = new EventSource('https://willyouback.shop/subscribe', {
//         headers: {
//             Authorization: `${token}`,
//             'Content-Type': 'text/event-stream',
//             Connection: 'keep-alive',
//             'Cache-Control': 'no-cache',
//         },
//         heartbeatTimeout: 3600000,
//     });

//     newSSE.onopen = () => {
//         console.log('SSE 연결됨');
//     };

//     newSSE.onmessage = (event) => {
//         console.log('알림 메시지 전달받음');
//         console.log(event);
//         console.log(event.data);

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
//         console.error('EventSource error:', e);
//         newSSE.close();
//     };

//     setSse(newSSE);
// }, [token, handleNewAlert]);

// const fetchAlerts = useCallback(async () => {
//     try {
//         const response = await fetch('https://willyouback.shop/alerts', {
//             method: 'GET',
//             headers: {
//                 Authorization: `${token}`,
//             },
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setAlerts(data.data); // 모든 알림 데이터를 저장
//     } catch (error) {
//         console.error('Fetching alerts failed:', error);
//     }
// }, [token]);

// // 컴포넌트가 마운트될 때 EventSource 초기화
// useEffect(() => {
//     initializeSSE();
//     fetchAlerts();
//     return () => {
//         sse?.close();
//     };
// }, [initializeSSE]);
