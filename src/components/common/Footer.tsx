import React from 'react'
import {AiOutlineHome} from "react-icons/ai"

function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 w-full hidden sm:block bg-white'>
      <nav className='flex justify-around text-[50px] py-4'>
        <button><AiOutlineHome/></button>
        <button><AiOutlineHome/></button>
        <button><AiOutlineHome/></button>
        <button><AiOutlineHome/></button>
      </nav>
    </footer>
  )
}

export default Footer
