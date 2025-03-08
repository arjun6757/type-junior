import { useEffect } from "react";
import Bottombar from "./bottombar";
import LoseFocus from "./losefocus";
import { words } from "@/helpers/words";
import { shuffle } from "@/helpers/helper";
import { useAllRefs, useAllStates } from "@/context/typeprovider";

export default function Placeholder() {

    const { placeholderRef, loseFocusElementRef, wordRef } = useAllRefs();

    const { randomWords, setRandomWords, caretPosition, setClassNames, wordClasses, activeIndex, classNames, loseFocus, timer, setTyped, setRightOnes, setActiveIndex, setWordClasses, setCaretPosition, setLoseFocus, setTimer, setTyping, setInital, typing, initial } = useAllStates();

    useEffect(() => {

        setRandomWords(words.slice(0, 50));

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

    const w_class = (wi) => {
        const classname = wordClasses[wi];

        if (classname === 'correct') {
            return 'text-gray-300';
        } else if (classname === 'wrong') {
            return 'text-red-500';
        }
    }

    const c_class = (wi, ci) => {
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
                const inital = Math.floor(Date.now() / 1000); // seconds
                setInital(inital);
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

    const handleBlur = () => {
        setTimeout(() => {
            if (!loseFocus) {
                setLoseFocus(true);
                focus(loseFocusElementRef);
            }
        }, 3000);
    }

    const handleReset = () => {
        setTyped('');
        setRightOnes([]);
        setActiveIndex(0);
        setClassNames([]);
        setWordClasses([]);
        setCaretPosition(0);
        setLoseFocus(false);
        setTimer(30);
        setTyping(false);
        const arr = shuffle(randomWords);
        setRandomWords(arr);
    }

    return (
        <div
            tabIndex={0}
            ref={placeholderRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="relative transition-all h-[14rem] overflow-hidden mt-16 mb-12 font-code text-3xl text-[#555] p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0">

            {randomWords.map((word, wordIndex) => (

                <div
                    ref={(el) => wordRef.current[wordIndex] = el}
                    key={wordIndex}
                    className={`${activeIndex === wordIndex ? "caret-container" : ""} flex ${w_class(wordIndex)}`}
                >
                    {word.split("").map((char, charIndex) => (

                        <span
                            data-char={char}
                            key={`${word}-${charIndex}`}
                            className={c_class(wordIndex, charIndex)}
                        >
                            {char}
                        </span>

                    ))}

                </div>
            ))}

            <LoseFocus />

            <Bottombar handleReset={handleReset} />

        </div>
    );
}