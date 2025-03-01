import { ArrowRightIcon, WrenchIcon, RotateCw } from "lucide-react";
import { obj } from "./words";
import { useState, useEffect, useRef } from "react";
import { useDomRefs } from "./utils/domRef";

export default function Content() {

    const [randomWords, setRandomWords] = useState([]);
    const [typed, setTyped] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const { wpmRef, timeRef, accuracyRef, placeholderRef } = useDomRefs();
    const wordRef = useRef([]);
    const [classNames, setClassNames] = useState(() => {
        const words = [...randomWords];
        return words[activeIndex] ? words[activeIndex].split("").map(() => "neutral") : [];
    }
    );

    useEffect(() => {
        for (let i = 0; i < 50; i++) {
            setRandomWords(prev => [...prev, obj.words[i]]);
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])


    const handleKeyDown = (e) => {
        const regex = /^[a-zA-Z0-9]$/;     // for filtering => single letter or number
        const valid = regex.test(e.key);

        if (valid) {
            const typedContent = typed + e.key;
            setTyped(typedContent);

            const newCharStates = [...charStates];
            const i = typedContent.length - 1;
            const words = [...randomWords];
            const currentWord = words[activeIndex];
            // const text = randomWords.join("");
            // newCharStates[i] = e.key === currentWord[i] ? "correct" : "incorrect";
            // setCharStates(newCharStates);

        } else if (e.key === 'Backspace') {
            const typedContent = typed.slice(0, -1);    // upto the last char but don't include it
            setTyped(typedContent);
        } else if (e.key ===" ") {
            console.log('Space detected')
            setActiveIndex(p=> p+1);
        }
    }

    return (
        <div className="flex-col h-full justify-center text-gray-300">
            <div className="flex w-full justify-between mt-2 py-4 px-12 font-semibold">
                <div className="flex items-center">
                    <span ref={timeRef} className="text-lg">60</span>
                    <p>s</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                        <span ref={wpmRef} className="text-lg">00</span>
                        <p>WPM</p>
                    </div>
                    <div className="flex items-center">
                        <span ref={accuracyRef} className="text-lg">100</span>
                        <p>%</p>
                    </div>
                </div>
            </div>


            <div ref={placeholderRef} className="relative h-[230px] overflow-hidden mt-16 mb-12 font-code text-3xl text-gray-500 p-4 px-12 flex gap-4 text-wrap flex-wrap select-none">
                {randomWords.map((word, wordIndex) => (
                    <div key={wordIndex} className="flex" >
                        {word.split("").map((char, charIndex) => (
                            <span
                                key={`${word}-${charIndex}`}
                                className={``}
                            >{char}</span>
                        ))}
                    </div>
                ))}
            </div>

            <div className="max-w-[200px] mx-auto flex justify-around mt-12">

                <button className="group bg-gray-800 focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-gray-400">
                    <ArrowRightIcon className="group-hover:text-gray-100 group-focus:translate-x-3 transition-transform duration-500" />
                </button>

                <button className="group bg-gray-800 focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-gray-400">
                    <RotateCw className="group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500" />
                </button>

                <button className="group bg-gray-800 focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-gray-400">
                    <WrenchIcon className="group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500" />
                </button>

            </div>
        </div>
    )
}
// // {charStates[charIndex] === "correct" ? "text-green-500" :
                                        // charStates[charIndex] === "incorrect" ? "text-red-500" :
                                            // "text-gray-500"
                                    // }