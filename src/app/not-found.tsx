
import Header from '@/components/common/Header';
import React from 'react'
import {GoAlert} from "react-icons/go";

function NotFound() {
  return (
    <div>
        <Header />
            <div className='flex items-center flex-col justify-center bg-matchpage-gradient h-[100vh]'>
                <div className='flex items-center flex-col'>
                    <div className='font-bold text-[47px] mb-4'><GoAlert color="#cb17f9"/></div>
                    <h1 className='text-4xl font-black mb-[48px]'>sorry</h1>
                    <h1 className='text-2xl mb-8'>앗! 잘못된 접근입니다.</h1>
                    <h1 className='text-2xl'>입력하신 정보가 맞는지 확인해주세요.</h1>
                </div>
        </div>
    </div>
  )
}

export default NotFound