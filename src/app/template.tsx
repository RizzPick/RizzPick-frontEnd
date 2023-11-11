'use client';
import { TransitionGroup, Transition } from 'react-transition-group';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const TIMEOUT = 150;
type TransitionStyles = {
    [key: string]: React.CSSProperties;
};
export const getTransitionStyles: TransitionStyles = {
    entering: {
        position: 'absolute',
        opacity: 0,
    },
    entered: {
        transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
        opacity: 1,
    },
    exiting: {
        transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
        opacity: 0,
    },
};

export default function Template({ children }: React.PropsWithChildren<{}>) {
    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    useEffect(() => {
        setScreenSize();
    });

    const router = usePathname();
    return (
        <div>
            <TransitionGroup style={{ position: 'relative' }}>
                <Transition
                    key={router}
                    timeout={{ enter: TIMEOUT, exit: TIMEOUT }}
                >
                    {(status) => (
                        <div style={{ ...getTransitionStyles[status] }}>
                            {children}
                        </div>
                    )}
                </Transition>
            </TransitionGroup>
        </div>
    );
}
