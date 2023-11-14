'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getCookie } from '@/utils/cookie';

const EventSourceContext = createContext<EventSourcePolyfill | null>(null);
const token = getCookie('Authorization');

export const EventSourceProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(
        null
    );

    useEffect(() => {
        if (!token) {
            // console.log('너 토큰 없잖아');
            return;
        } else {
            const es = new EventSourcePolyfill(
                'https://willyouback.shop/subscribe',
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'text/event-stream',
                        Connection: 'keep-alive',
                        'Cache-Control': 'no-cache',
                    },
                    heartbeatTimeout: 3600000, // 1 hour
                }
            );
            // console.log();
            // EventSource 객체를 상태에 설정합니다.
            setEventSource(es);

            // 컴포넌트가 언마운트될 때 EventSource를 닫습니다.
            return () => {
                // console.log('SSE 언마운트');
                es.close();
            };
        }
    }, []);

    return (
        <EventSourceContext.Provider value={eventSource}>
            {children}
        </EventSourceContext.Provider>
    );
};

export const useEventSource = () => {
    return useContext(EventSourceContext);
};
