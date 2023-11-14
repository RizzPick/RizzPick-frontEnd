'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookie } from '@/utils/cookie';

const EventSourceContext = createContext<EventSourcePolyfill | null>(null);

export const EventSourceProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(
        null
    );

    useEffect(() => {
        const token = getCookie('Authorization');
        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }

        // EventSource 인스턴스를 생성합니다.
        try {
            const es = new EventSourcePolyfill(
                'https://willyouback.shop/subscribe',
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'text/event-stream',
                        Connection: 'keep-alive',
                        'Cache-Control': 'no-cache',
                    },
                    heartbeatTimeout: 3600000, // 1 hour
                }
            );

            setEventSource(es);

            // 컴포넌트가 언마운트될 때 EventSource를 닫습니다.
            return () => {
                // console.log('SSE 언마운트');
                es.close();
            };
        } catch (error) {
            console.error('Error initializing EventSource:', error);
        }
    }, []);

    return (
        <EventSourceContext.Provider value={eventSource}>
            {children}
        </EventSourceContext.Provider>
    );
};

// useEventSource 훅을 정의합니다.
export const useEventSource = () => {
    return useContext(EventSourceContext);
};
