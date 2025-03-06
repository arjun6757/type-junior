import { RotateCw } from "lucide-react";
import { obj } from "./words";
import { useState, useEffect, useRef } from "react";
import { useDomRefs } from "./utils/domRef";
import { MousePointer } from "lucide-react";
import { Clock } from "lucide-react";

export default function Content() {
    const { wpmRef, timeRef, accuracyRef, placeholderRef } = useDomRefs();
    const loseFocusElementRef = useRef(null);
    const [rightOnes, setRightOnes] = useState([]);
    const [typed, setTyped] = useState('');
    const [randomWords, setRandomWords] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [classNames, setClassNames] = useState(["correct"]);
    const [wordClasses, setWordClasses] = useState([]);
    const correctRef = useRef(null);
    const wordRef = useRef([]);
    const [caretPosition, setCaretPosition] = useState(0);
    const caretRef = useRef(null);
    const [loseFocus, setLoseFocus] = useState(false);
    const [timer, setTimer] = useState(30);
    const [typing, setTyping] = useState(false);

    const focus = (itemRef) => {
        if (itemRef.current) {
            itemRef.current.focus();
        }
    }

    useEffect(() => {

        if (!typing) return;

        const intervalID = setInterval(() => {
            setTimer(p => p > 0 ? p - 1 : 0);
        }, 1000)


        return () => clearInterval(intervalID);

    }, [typing])

    const shuffle = (arr) => {
        // in random order
        const temp = [];

        for (let i = 0; i < arr.length; i++) {
            const ridx = Math.floor(Math.random() * temp.length);
            temp[i] = arr[ridx];
        }

        return temp;
    }

    useEffect(() => {

        setRandomWords(obj.words.slice(0, 50));

        if (placeholderRef.current) {
            placeholderRef.current.focus();
        }

    }, [])

    useEffect(() => {
        if (randomWords.length != 0) {
            const activeWord = randomWords[activeIndex];
            const object = activeWord?.split("").map(() => 'neutral');
            setClassNames(object);
        }

    }, [randomWords])

    const handleKeyDown = (e) => {

        if (loseFocus) return;
        if (timer === 0) return;

        const regex = /^[a-zA-Z0-9]$/;     // for filtering => single letter or number
        const valid = regex.test(e.key);

        if (valid) {

            const typedContent = typed + e.key;

            if (typedContent.trim() === "") {
                return;
            }

            setTyped(typedContent);

            if (!typing) {
                setTyping(true);
            }

            const currentWord = randomWords[activeIndex];
            const index = typedContent.length - 1; // this will always get the recent typed char
            const string = typedContent.split("")[index] === currentWord.split("")[index] ? 'correct' : 'wrong';

            const classes = [...classNames];
            classes[index] = string;
            setClassNames(classes);
            const caretValue = typedContent.length;
            setCaretPosition(p => p + caretValue);

        } else if (e.key === 'Backspace') {
            const typedContent = typed.slice(0, -1);    // upto the last char but don't include it
            setTyped(typedContent);
            const newClasses = classNames.slice(0, -1); // upto the last class but don't include it
            setClassNames(newClasses);
            if (caretPosition === 0) return;
            else {
                const caretValue = typedContent.length;
                setCaretPosition(p => p - caretValue);
            }

        } else if (e.key === " ") {

            const currentWord = randomWords[activeIndex];
            const correctOnes = classNames.filter((value) => value === 'correct');

            if (correctOnes.length === currentWord.length) {

                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "correct";
                setWordClasses(classes);
                setRightOnes(p => [...p, activeIndex]);

            } else {
                const classes = [...wordClasses]; // make a shallow copy
                classes[activeIndex] = "wrong";
                setWordClasses(classes);
            }

            if (activeIndex !== randomWords.length) {
                setActiveIndex(p => p + 1);
            }
            // have to work here too
            setClassNames([]);
            setTyped('');
            const caretValue = " ".length;
            setCaretPosition(p => p + caretValue);
        }
    }

    const logicBasedClass = (wi, ci) => {
        if (placeholderRef?.current?.querySelector('.caret-block')) {
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
                placeholderRef.current.scrollTo({
                    top: activeWord.offsetTop - placeholderRef.current.offsetTop + 4,
                    behavior: "smooth", // Smooth scrolling
                });
            }
        }
    }, [activeIndex]); // Scrolls when activeIndex changes


    // useEffect(() => {
    //     if (loseFocus) {
    //         loseFocusElementRef.current?.focus();
    //     } else {
    //         placeholderRef.current?.focus();
    //     }
    // }, [loseFocus])

    return (
        <div className="flex-col h-full justify-center">
            <div className="flex w-full text-sm text-gray-300 justify-between mt-12 px-10 py-2">
                <div className={`flex items-center gap-2 font-bold ${typing ? "text-gray-400" : "text-[#999]"}`}>
                    <Clock className="h-4 w-4" />
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

            <div
                tabIndex={0}
                ref={placeholderRef}
                onBlur={() => {
                    setLoseFocus(true);
                    focus(loseFocusElementRef);
                }}
                onKeyDown={handleKeyDown}
                className="relative transition-all h-[14rem] overflow-hidden mt-16 mb-12 font-code text-3xl text-[#555] p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0">

                <div
                    tabIndex={loseFocus ? 0 : -1}
                    ref={loseFocusElementRef}
                    onClick={() => {
                        setLoseFocus(false);
                    }}
                    onKeyDown={() => {
                        setLoseFocus(false);
                    }}

                    className={
                        `
                    transition-opacity duration-300 absolute inset-0 h-full text-gray-300 
                    flex justify-center items-center gap-4 flex-nowrap
                    text-sm focus:outline-0 backdrop-blur-sm ${loseFocus ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                    `
                    }
                >
                    <MousePointer className="h-4 w-4" />
                    <span>Click here or press any key to focus</span>
                </div>

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
                ))

                }


            </div>

            <div className="max-w-fit mx-auto mt-12">

                <button className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]">
                    <RotateCw className="h-4 w-4 group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500" />
                </button>

            </div>
        </div >
    )
}