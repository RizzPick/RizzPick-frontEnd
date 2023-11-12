import React from 'react'
import { GoAlert } from 'react-icons/go'

const NoUserAlert: React.FC = () => {
  return (
    <div className='flex items-center flex-col justify-center h-screen sm:h-[60vh] bg-matchpage-gradient'>
        <div className='flex items-center flex-col'>
            <div className='font-bold text-[47px] mb-4'><GoAlert color="#cb17f9"/></div>
            <h1 className='text-4xl font-black mb-[48px]'>sorry</h1>
            <h1 className='text-2xl mb-8'>앗! 추천할 유저가 없네요.</h1>
            <h1 className='text-2xl'>다른 유저가 나타날 때까지 조금만 기다려 주세요.</h1>
        </div>
    </div>
  )
}

export default NoUserAlert