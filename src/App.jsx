import React from 'react'
import Content from './Content'
import { useState } from 'react'
import { useEffect } from 'react';

export default function App() {
  const [title, setTitle] = useState('Typing Tester');

  const handleTitleClick = () => {
    setTitle('Test your typing!');
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitle('Typing Tester');
    }, 2000);

    return () => clearTimeout(timeoutId);
    // need to explicitly return it

  }, [title])

  return (
    <div className='bg-[#171717] text-[#888] w-screen h-screen font-inter text-sm overflow-hidden'>
      <div className="flex justify-between bg-transparent p-2 border-b border-[#333]">
        <span onClick={handleTitleClick} className="text-md h-full cursor-pointer text-gray-300 select-none p-3 rounded-md w-fit active:scale-95 transition-transform">{title}</span>
      </div>
      <Content />
    </div>
  )
}