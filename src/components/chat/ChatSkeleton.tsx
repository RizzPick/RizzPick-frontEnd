import React from 'react'

function ChatSkeleton() {
  return (
    <div className="animate-pulse h-[calc(700px)] overflow-y-auto pb-4 scrollbar-hide" role='status'>
            <div className='flex justify-start'>
                <div className='flex items-center gap-2 mb-2 relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-400'></div>
                    <p className='bg-gray-200 rounded-2xl px-4 py-2 w-96 h-12'/>
                </div>
            </div>
            <div className='flex items-center mb-2 justify-end'>
                <p className='bg-gray-400 rounded-2xl px-4 py-2 w-96 h-12'/>
            </div>
            <div className='flex justify-start'>
                <div className='flex items-center gap-2 mb-2 relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-400'></div>
                    <p className='bg-gray-200 rounded-2xl px-4 py-2 w-96 h-28'/>
                </div>
            </div>
            <div className='flex items-center mb-2 justify-end'>
                <p className='bg-gray-400 rounded-2xl px-4 py-2 w-96 h-12'/>
            </div>
            <div className='flex justify-start'>
                <div className='flex items-center gap-2 mb-2 relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-400'></div>
                    <p className='bg-gray-200 rounded-2xl px-4 py-2 w-96 h-12'/>
                </div>
            </div>
            <div className='flex items-center mb-2 justify-end'>
                <p className='bg-gray-400 rounded-2xl px-4 py-2 w-96 h-12'/>
            </div>
            <div className='flex justify-start'>
                <div className='flex items-center gap-2 mb-2 relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-400'></div>
                    <p className='bg-gray-200 rounded-2xl px-4 py-2 w-96 h-12'/>
                </div>
            </div>
            <div className='flex items-center mb-2 justify-end'>
                <p className='bg-gray-400 rounded-2xl px-4 py-2 w-96 h-12'/>
            </div>
            <div className='flex items-center mb-2 justify-end'>
                <p className='bg-gray-400 rounded-2xl px-4 py-2 w-96 h-12'/>
            </div>
            <div className='flex justify-start'>
                <div className='flex items-center gap-2 mb-2 relative'>
                    <div className='w-12 h-12 rounded-full bg-gray-400'></div>
                    <p className='bg-gray-200 rounded-2xl px-4 py-2 w-96 h-12'/>
                </div>
            </div>
    </div>
  )
}

export default ChatSkeleton