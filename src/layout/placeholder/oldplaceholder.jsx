import { useEffect, useState } from "react";
import LoseFocus from "./losefocus";
import { words } from "@/helpers/words";
import { useAllRefs, useAllStates } from "@/context/typeprovider";
import { useActions } from "@/context/ActionsProvider";

export default function Placeholder() {

    const [caretPosition, setCaretPosition] = useState(0);

    const { placeholderRef, loseFocusElementRef, wordRef } = useAllRefs();
    const { words, setWords } = useActions();

    const
        { randomWords, setRandomWords,
            setClassNames, wordClasses,
            activeWordIndex: activeIndex, classNames,
            loseFocus, timer,
            setTyped, setRightOnes,
            setActiveWordIndex: setActiveIndex, setWordClasses,
            setLoseFocus, setTimer,
            setTyping, setInital,
            typing, initial: initialValue
        } = useAllStates();

    useEffect(() => {

        setRandomWords(words.slice(0, 50));

        if (placeholderRef.current) {
            placeholderRef.current.focus();
        }

    }, [])

    // useEffect(() => {
    //     if (randomWords.length != 0) {
    //         for (let i = 0; i < randomWords.length; i++) {
    //             const word = randomWords[i];
    //             const charArray = word.split("");
    //             setWords(p => [...p, { word: word, chars: charArray }]);
    //         }
    //     }
    // }, [randomWords])

    useEffect(() => {
        if (randomWords.length != 0) {
            const activeWord = randomWords[activeIndex];
            const object = activeWord?.split("").map(() => 'neutral');
            setClassNames(object);
        }

    }, [randomWords])


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

    const handleValidKeyStroke = (e) => {
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
    }

    const handleBackSpace = () => {
        const typedContent = typed.slice(0, -1);    // upto the last char but don't include it
        setTyped(typedContent);
        const newClasses = classNames.slice(0, -1); // upto the last class but don't include it
        setClassNames(newClasses);
        if (caretPosition === 0) return;
        else {
            const caretValue = typedContent.length;
            setCaretPosition(p => p - caretValue);
        }
    }

    const handleSpace = () => {
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

    const handleKeyDown = (e) => {
        if (loseFocus) return;
        if (timer === 0) return;

        const regex = /^[a-zA-Z0-9]$/;     // for filtering => single letter or number
        const valid = regex.test(e.key);

        if (valid) {
            handleValidKeyStroke(e);
        } else if (e.key === 'Backspace') {
            handleBackSpace();
        } else if (e.key === " ") {
            handleSpace();
        }
    }

    const handleBlur = () => {
        const timeoutId = setTimeout(() => {
            if (!loseFocus) {
                setLoseFocus(true);
                focus(loseFocusElementRef);
            }
        }, 3000);

        return () => clearTimeout(timeoutId);
    }

    return (
        <div
            tabIndex={0}
            ref={placeholderRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="relative transition-all h-[14rem] overflow-hidden mt-16 mb-12 font-code text-3xl text-[#555] p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0"
        >

            {randomWords.map((word, wordIndex) => (

                <div
                    ref={(el) => wordRef.current[wordIndex] = el}
                    key={wordIndex}
                    className="flex"
                >
                    {word.split("").map((char, charIndex) => (

                        <span
                            key={`${word}-${charIndex}`}
                            data-char={char}
                            className={c_class(wordIndex, charIndex)}
                        >
                            {char}
                        </span>

                    ))}

                </div>
            ))}

            <LoseFocus />

        </div>
    );
}