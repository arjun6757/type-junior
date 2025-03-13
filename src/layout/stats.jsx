import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function stats() {

    const [timer, setTimer] = useState(0);
    const timeRef = useRef(null);
    const wpmRef = useRef(null);
    const [typing, setTyping] = useState(true);
    const [wpm, setWpm] = useState(0);


    // const runTimer = (time) => {
    //     if (time === 0) return;

    //     console.log("time: ", time);

    //     setTimeout(() => {
    //         setTimer(time - 1);
    //         runTimer(time - 1);
    //     }, 1000);
    // }

    // useEffect(() => {
    //     runTimer(30);
    // }, []);

    return (
        <div className="flex w-full text-sm justify-between mt-[5rem]">
            <div
                className='flex w-full text-[#666] justify-between gap-2 px-12 font-code text-3xl'
            >
                <span ref={timeRef}>{timer}</span>
                <span ref={wpmRef}>{wpm} wpm</span>
            </div>
        </div>
    )
}
