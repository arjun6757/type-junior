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
    <div className='bg-gray-900 w-screen h-screen font-inter text-sm overflow-hidden'>
      <div className="flex justify-between p-3 bg-gray-900 border-b border-gray-700">
        <span onClick={handleTitleClick} className="text-md cursor-pointer text-gray-100 select-none bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-lg px-2 py-1 w-fit active:scale-95 transition-transform">{title}</span>
      </div>
      <Content />
    </div>
  )
}