// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import { getCookie } from '@/utils/cookie';
// import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

// export type Alert = {
//     id: number;
//     receiver: { id: number };
//     sender: { id: number };
//     message: string;
//     content: string;
//     url: string;
//     time: string;
//     readStatus: boolean;
// };

// type AlertContextType = {
//     alerts: Alert[];
//     setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
//     addAlert: (newAlert: Alert) => void;
// };

// export const AlertContext = createContext<AlertContextType | undefined>(undefined);

// export const AlertProvider: React.FC = ({ children }) => {
//     const [alerts, setAlerts] = useState<Alert[]>([]);
//     const token = getCookie('Authorization');
//     const EventSource = EventSourcePolyfill || NativeEventSource;
//     const sseRef = useRef<EventSourcePolyfill | null>(null);

//     // 실시간 알림 데이터 처리
//     const handleNewAlert = useCallback((newAlert: Alert) => {
//         setAlerts((currentAlerts) => [...currentAlerts, newAlert]);
//     }, []);

//     // 실시간 연결 초기화 및 이벤트 핸들러 설정
//     useEffect(() => {
//         if (!token || sseRef.current) return;

//         const sse = new EventSource('https://willyouback.shop/subscribe', {
//             headers: {
//                 Authorization: `${token}`,
//                 'Content-Type': 'text/event-stream',
//                 Connection: 'keep-alive',
//                 'Cache-Control': 'no-cache',
//             },
//             heartbeatTimeout: 3600000,
//         });

//         sse.onopen = () => {
//             console.log('SSE 연결됨');
//         };

//         sse.onmessage = (event) => {
//             if (event.data.startsWith('{')) {
//                 const newAlert = JSON.parse(event.data);
//                 handleNewAlert(newAlert);
//             }
//         };

//         sse.onerror = (e) => {
//             console.error('EventSource error:', e);
//             sse.close();
//             sseRef.current = null;
//         };

//         sseRef.current = sse;

//         return () => {
//             if (sseRef.current) {
//                 sseRef.current.close();
//                 sseRef.current = null;
//             }
//         };
//     }, [token, handleNewAlert]);

//     const addAlert = (newAlert: Alert) => {
//         handleNewAlert(newAlert);
//     };

//     return (
//         <AlertContext.Provider value={{ alerts, setAlerts, addAlert }}>
//             {children}
//         </AlertContext.Provider>
//     );
// };
