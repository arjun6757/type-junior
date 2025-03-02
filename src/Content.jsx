import { ArrowRightIcon, WrenchIcon, RotateCw } from "lucide-react";
import { obj } from "./words";
import { useState, useEffect, useRef } from "react";
import { useDomRefs } from "./utils/domRef";

export default function Content() {
    const { wpmRef, timeRef, accuracyRef, placeholderRef } = useDomRefs();

    const [rightOnes, setRightOnes] = useState([]);
    const [typed, setTyped] = useState('');
    const [randomWords, setRandomWords] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [classNames, setClassNames] = useState([]);
    const [wordClasses, setWordClasses] = useState([]);
    const wordRef = useRef([]);

    useEffect(() => {
        // for (let i = 0; i < 50; i++) {
        //     setRandomWords(prev => [...prev, obj.words[i]]);
        // }
        setRandomWords(obj.words.slice(0, 50));

        if (placeholderRef.current) {
            placeholderRef.current.focus();
        }

        // window.addEventListener('keydown', handleKeyDown);

        // return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    useEffect(() => {
        if (randomWords.length != 0) {
            const activeWord = randomWords[activeIndex];
            const object = activeWord?.split("").map(() => 'neutral');
            setClassNames(object);
        }

    }, [randomWords])

    const handleKeyDown = (e) => {
        // e.preventDefault();
        const regex = /^[a-zA-Z0-9]$/;     // for filtering => single letter or number
        const valid = regex.test(e.key);

        if (valid) {
            const typedContent = typed + e.key;
            setTyped(typedContent);

            const currentWord = randomWords[activeIndex];
            console.log('currentword: ', currentWord);
            const index = typedContent.length - 1; // this will always get the recent typed char
            console.log('index: ', index);
            const string = typedContent.split("")[index] === currentWord.split("")[index] ? 'correct' : 'wrong';

            const classes = [...classNames];
            classes[index] = string;
            console.log('classes: ', classes);
            setClassNames(classes);

        } else if (e.key === 'Backspace') {
            const typedContent = typed.slice(0, -1);    // upto the last char but don't include it
            setTyped(typedContent);
            const newClasses = classNames.slice(0, -1); // upto the last class but don't include it
            console.log('classes after backspace: ', newClasses);
            setClassNames(newClasses);

        } else if (e.key === " ") {

            // i need to check here if all classes are correct or not and make a state to track which one's are right

            const currentWord = randomWords[activeIndex];
            const correctOnes = classNames.filter((value) => value === 'correct');

            if (correctOnes.length === currentWord.length) {
                console.log('matched');
                // that means all of its characters are correct so highlight this word as white
                // wordRef.current[activeIndex].classList.add('text-gray-300');
                // document.getElementById(`word${activeIndex}`).style.color = "white";
                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "correct";
                setWordClasses(classes);
                setRightOnes(p => [...p, activeIndex]);  // keeping track of the index which was correct
            } else {
                // wordRef.current[activeIndex].classList.add('text-red-500');
                // document.getElementById(`word${activeIndex}`).style.color = "red";
                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "wrong";
                setWordClasses(classes);
            }

            console.log('Space detected')
            setActiveIndex(p => p + 1);
            setClassNames([]);
            setTyped('');
        }
    }

    /**
     * Description of logicBasedClass function
     * @param {number} wi
     * @param {string} char
     * @param {number} ci
     * @returns {string} a tailwindcss className
     */

    const logicBasedClass = (wi, char, ci) => {
        // wordIndex === activeIndex ? `${classNames[charIndex] === 'correct' ? 'text-gray-300' :
        //     classNames[charIndex] === 'wrong' ? 'text-red-500' : null}
        //  }` : null

        if(document.querySelector('.caret-block')) {
            const el = document.querySelector('.caret-block');
            console.log("before removing: ", el.classList);
            el.classList.remove('caret-block');
            console.log("after removing: ", el.classList);
        }

        if (wi === activeIndex) {
            // as we wanna return it for only the active word
            const classname = classNames[ci];

            if (classname === 'correct') {
                return 'text-gray-300 caret-block';
            } else if (classname === 'wrong') {
                return 'text-red-500 caret-block';
            }
            // const className = classNames[ci] === 'correct' ? 'text-gray-300' :
            //     classNames[ci] === 'wrong' ? 'text-red-500' : null;

            // return className;
        }
    }

    const logicBasedWordClass = (wi) => {
        const classname = wordClasses[wi];

        if (classname === 'correct') {
            return 'text-gray-300';
        } else if (classname === 'wrong') {
            return 'text-red-500';
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


            <div tabIndex={0} ref={placeholderRef} onKeyDown={handleKeyDown} className="relative h-[230px] overflow-hidden mt-16 mb-12 font-code text-3xl text-gray-500 p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0">
                {randomWords.map((word, wordIndex) => (
                    <div id={`word${wordIndex}`} ref={(el) => wordRef.current[wordIndex] = el} key={wordIndex} className={`${activeIndex === wordIndex ? "caret-container" : ""} flex 
                    ${logicBasedWordClass(wordIndex)}
                    `} >

                        {word.split("").map((char, charIndex) => (
                            <span
                                key={`${word}-${charIndex}`}
                                className={logicBasedClass(wordIndex, char, charIndex)}
                            >
                                {char}
                            </span>
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