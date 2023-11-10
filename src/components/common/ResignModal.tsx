import useAuth from '@/hooks/useAuth'
import { MyProfileRes } from '@/types/profile'
import React from 'react'

type Props = {
    setResignModal : React.Dispatch<React.SetStateAction<boolean>>;
    profile : MyProfileRes
}

function ResignModal({setResignModal, profile}: Props) {
    const {deActiveUser} = useAuth();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={() => setResignModal(false)}></div>
        
        {/* 모달 창 */}
        <div className="bg-white p-2 rounded-xl shadow-lg w-[400px] z-10 h-60 flex flex-col items-center justify-center">
            <div className='text-2xl font-normal mb-4'>회원 탈퇴</div>
            <p className='px-8 text-stone-500 text-lg'>계정을 탈퇴 시에 사용자 정보가 함께 삭제되며, 삭제 후에는 다시 되돌릴 수 없습니다.</p>
            <p className='mt-4 text-stone-500 text-lg'>정말로 탈퇴하시겠습니까?</p>
            <div className="flex justify-between mt-4 w-full px-6">
                <button onClick={() => setResignModal(false)} className="mr-2 px-4 py-2 rounded">취소</button>
                <button onClick={() => { deActiveUser(profile.userId); setResignModal(false)}} className="bg-rose-100 rounded-xl px-4 py-2rounded-lg transition-all hover:scale-125 text-red-500">탈퇴</button>
            </div>
        </div>
    </div>
  )
}

export default ResignModal