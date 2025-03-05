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
    const [classNames, setClassNames] = useState(["correct"]);
    const [wordClasses, setWordClasses] = useState([]);
    const correctRef = useRef(null);
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
            // console.log('currentword: ', currentWord);
            const index = typedContent.length - 1; // this will always get the recent typed char
            // console.log('index: ', index);
            const string = typedContent.split("")[index] === currentWord.split("")[index] ? 'correct' : 'wrong';

            const classes = [...classNames];
            classes[index] = string;
            // console.log('classes: ', classes);
            setClassNames(classes);

        } else if (e.key === 'Backspace') {
            const typedContent = typed.slice(0, -1);    // upto the last char but don't include it
            setTyped(typedContent);
            const newClasses = classNames.slice(0, -1); // upto the last class but don't include it
            // console.log('classes after backspace: ', newClasses);
            setClassNames(newClasses);

        } else if (e.key === " ") {

            // also need to check if the current line is last line somehow


            // i need to check here if all classes are correct or not and make a state to track which one's are right

            const currentWord = randomWords[activeIndex];
            const correctOnes = classNames.filter((value) => value === 'correct');

            if (correctOnes.length === currentWord.length) {
                // console.log('matched');
                // that means all of its characters are correct so highlight this word as white
                // wordRef.current[activeIndex].classList.add('text-gray-300');
                // document.getElementById(`word${activeIndex}`).style.color = "white";
                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "correct";
                setWordClasses(classes);
                setRightOnes(p => [...p, activeIndex]);

                // keeping track of the index which was correct
            } else {
                // wordRef.current[activeIndex].classList.add('text-red-500');
                // document.getElementById(`word${activeIndex}`).style.color = "red";
                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "wrong";
                setWordClasses(classes);
            }

            // console.log('Space detecte')
            if (activeIndex !== randomWords.length) {
                setActiveIndex(p => p + 1);
            }
            // have to work here too
            setClassNames([]);
            setTyped('');
        }
    }

    const logicBasedClass = (wi, ci) => {
        // wordIndex === activeIndex ? `${classNames[charIndex] === 'correct' ? 'text-gray-300' :
        //     classNames[charIndex] === 'wrong' ? 'text-red-500' : null}
        //  }` : null

        if (placeholderRef?.current?.querySelector('.caret-block')) {
            // console.log('working great ?')
            const el = placeholderRef?.current?.querySelector('.caret-block');
            el.classList.remove('caret-block');
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

    useEffect(() => {
        if (placeholderRef.current) {
            const activeWord = wordRef.current[activeIndex];
            if (activeWord) {
                console.log('acive word offset top: ', activeWord?.offsetTop);
                console.log('placeholder offset top: ', placeholderRef?.current?.offsetTop);
                placeholderRef.current.scrollTo({
                    top: activeWord.offsetTop - placeholderRef.current.offsetTop + 4,
                    behavior: "smooth", // Smooth scrolling
                });
            }
        }
    }, [activeIndex]); // Scrolls when activeIndex changes

    return (
        <div className="flex-col h-full justify-center text-gray-300">
            <div className="flex w-full justify-between mt-2 py-4 px-12 font-semibold">
                <div className="flex items-center">
                    <span ref={timeRef} className="text-lg">60</span>
                    <p>s</p>
                </div>

                <div className="flex gap-4">

                    <div className="flex gap-2 items-center">
                        <span ref={correctRef} className="uppercase">Correct :</span>
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

            <div tabIndex={0} ref={placeholderRef} onKeyDown={handleKeyDown} className="relative transition-all h-[14rem] overflow-hidden mt-16 mb-12 font-code text-3xl text-[#555] p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0">
                {randomWords.map((word, wordIndex) => (

                    <div
                        ref={(el) => wordRef.current[wordIndex] = el}
                        key={wordIndex}
                        className={`${activeIndex === wordIndex ? "caret-container" : ""} flex ${logicBasedWordClass(wordIndex)}`}
                    >
                        {word.split("").map((char, charIndex) => (

                            <span
                                data-char={char}
                                key={`${word}-${charIndex}`}
                                className={logicBasedClass(wordIndex, charIndex)}
                            >
                                {char}
                            </span>

                        ))}

                    </div>
                ))}
            </div>

            <div className="max-w-[200px] mx-auto flex justify-around mt-12">

                <button className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]">
                    <ArrowRightIcon className="group-hover:text-gray-100 group-focus:translate-x-3 transition-transform duration-500" />
                </button>

                <button className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]">
                    <RotateCw className="group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500" />
                </button>

                <button className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]">
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