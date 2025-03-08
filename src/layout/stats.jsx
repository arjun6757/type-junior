import { ClockIcon } from "@/components/Icons";
import { useAllRefs, useAllStates } from "@/context/typeprovider"
import { calculateWPM } from "@/helpers/helper";
import { useEffect } from "react";

export default function Stats() {

    const { typing, timer, setTimer, rightOnes, initial } = useAllStates();
    const { timeRef, correctRef, wpmRef, accuracyRef } = useAllRefs();

    useEffect(() => {

        if (!typing) return;

        const timerInterval = setInterval(() => {
            setTimer(p => p > 0 ? p - 1 : 0);
        }, 1000)

        return () => {
            clearInterval(timerInterval);
        }

    }, [typing]);

    useEffect(() => {

        let wpm = 0;

        const wpmInterval = setInterval(() => {
            const endingTime = Math.floor(Date.now() / 1000); // seconds
            wpm = calculateWPM(rightOnes.length, endingTime - initial);
            if (wpmRef.current) {
                wpmRef.current.textContent = wpm;
            }

        }, 300)


        return () => {
            clearInterval(wpmInterval)
        }

    }, [rightOnes]);

    return (
        <div className="flex w-full text-sm text-gray-300 justify-between mt-12 px-10 py-2">

            <div className={`flex items-center gap-2 font-bold ${typing ? "text-gray-400" : "text-[#999]"}`}>
                <ClockIcon />
                <span ref={timeRef}>{timer}</span>
            </div>

            <div className="flex gap-4">

                <div className="flex gap-2 items-center">
                    <span ref={correctRef}>Correct :</span>
                    <p>{rightOnes.length}</p>
                </div>

                <div className="flex gap-2 items-center">
                    <span ref={wpmRef}>00</span>
                    <p>WPM</p>
                </div>
                <div className="flex items-center">
                    <span ref={accuracyRef}>100</span>
                    <p>%</p>
                </div>
            </div>
        </div>
    )
}