'use client'
import { TransitionGroup, Transition } from "react-transition-group";
import { usePathname } from 'next/navigation';
const TIMEOUT = 150;
export const getTransitionStyles : any = {
	entering: {
		position: 'absolute',
		opacity: 0
	},
	entered: {
		transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
		opacity: 1
	},
	exiting: {
		transition: `opacity ${TIMEOUT}ms ease-in-out, transform ${TIMEOUT}ms ease-in-out`,
		opacity: 0
	}
};


export default function Template({ children }: { children: React.ReactNode }) {
    const router = usePathname();
    return <div>
        <TransitionGroup style={{position:'relative'}}>
                    <Transition key={router} timeout={{enter:TIMEOUT, exit:TIMEOUT}}>
                        {(status) => (
                            <div style={{...getTransitionStyles[status]}}>
                            {children}
                            </div>
                        )}
                    </Transition>
                </TransitionGroup>
        </div>
  }