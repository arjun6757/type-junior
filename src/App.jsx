import React from 'react'
import Content from './Content'
import { useState } from 'react'
import { useEffect } from 'react';

export default function App() {
  const [title, setTitle] = useState('Type Junior');

  const handleTitleClick = () => {
    setTitle('Test your typing!');
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitle('Type Junior');
    }, 2000);

    return () => clearTimeout(timeoutId);
    // need to explicitly return it

  }, [title])

  return (
    <div className='bg-[#171717] w-screen h-screen font-inter text-sm overflow-hidden'>
      <div className="flex justify-between bg-transparent p-3 border-b border-[#333]">
        <span onClick={handleTitleClick} className="text-md h-full cursor-pointer text-gray-200 select-none p-2 rounded-md w-fit active:scale-95 transition-transform">{title}</span>
      </div>
      <Content />
    </div>
  )
}