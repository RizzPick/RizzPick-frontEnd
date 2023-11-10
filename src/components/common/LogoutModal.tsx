import useAuth from '@/hooks/useAuth';
import React from 'react'

type Props = {
    setShowLogoutModal : React.Dispatch<React.SetStateAction<boolean>>;
}

function LogoutModal({setShowLogoutModal} : Props) {
    const {logout} = useAuth();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={() => setShowLogoutModal(false)}></div>
        
        <div className="bg-white p-2 rounded-xl shadow-lg w-96 z-10 h-52 flex flex-col items-center justify-center">
            <div className='text-2xl text-zinc-800 font-normal'>로그아웃 할까요?</div>
            <div className="flex justify-around mt-10 w-full px-6">
                <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 rounded">취소</button>
                <button onClick={() => { logout(); setShowLogoutModal(false); }} className="px-5 py-2 rounded-xl bg-fuchsia-400 text-white transition-all hover:scale-125">확인</button>
            </div>
        </div>
    </div>
  )
}

export default LogoutModal