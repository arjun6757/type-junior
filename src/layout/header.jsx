import { useState, useEffect } from "react";

export default function Header() {

    const [title, setTitle] = useState('Type Junior');

    const handleTitleClick = () => {
        setTitle('Test your typing!');
    }

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            setTitle('Type Junior');
        }, 2000);

        return () => clearTimeout(timeoutId);

    }, [title])

    return (

        <div className="flex justify-between bg-transparent p-3 border-b border-[#555]">
            <span onClick={handleTitleClick} className="text-md h-full cursor-pointer text-gray-200 select-none p-2 rounded-md w-fit active:scale-95 transition-transform">{title}</span>
        </div>
    )
}