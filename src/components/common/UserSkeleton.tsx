import React from 'react'

function UserSkeleton() {
  return (
    <>
        <div className="animate-pulse h-[231px] w-[231px] rounded-full bg-gray-400 overflow-hidden mx-auto mt-5" role='status'/>
        <hr className='my-4' />
        <div className='flex flex-col gap-4'>
            <div className='bg-gray-300 h-16 rounded-md'/>
            <div className='bg-gray-300 h-20 rounded-md'/>
            <div className='bg-gray-300 h-36 rounded-md'/>
        </div>
    </>
  )
}

export default UserSkeleton