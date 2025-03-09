import { useEffect, useState, useRef } from "react";
import LoseFocus from "./losefocus";
import { words } from "@/helpers/words";
import { useAllRefs, useAllStates } from "@/context/typeprovider";

export default function Placeholder() {

    const { loseFocus, setLoseFocus } = useAllStates();
    const { placeholderRef, loseFocusElementRef } = useAllRefs();
    const [wordArray, setWordArray] = useState([]);
    const [wordDetails, setWordDetails] = useState([]);
    const [typed, setTyped] = useState("");
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [activeCharIndex, setActiveCharIndex] = useState(0);
    const [caretPosi, setCaretPosi] = useState(0);
    const charRef = useRef([]);
    const wordRef = useRef([]);

    console.log(typed);

    useEffect(() => {

        setWordArray(words.slice(0, 50));

        if (placeholderRef.current) {
            placeholderRef.current.focus();
        }

    }, [])

    useEffect(() => {
        if (wordArray.length != 0) {

            for (let i = 0; i < wordArray.length; i++) {
                const word = wordArray[i];

                if (word) {
                    const charArray = word.split("");
                    const charClassNamesArray = word.split("").map(() => "character");
                    setWordDetails(p => [...p, { wordIndex: i, chars: charArray, classNames: charClassNamesArray }]);
                }

            }
        }
    }, [wordArray])

    const check = (character) => {
        const filteredWordDetails = wordDetails.filter((obj) => obj.wordIndex === activeWordIndex)[0];
        // have to track character too
        // const filteredCharIndex = filteredWordDetails.chars.findIndex((obj) => obj === character);
        const filteredChar = filteredWordDetails.chars[activeCharIndex];

        if (filteredChar === character) {
            const name = "correct";
            const newClassNameArray = [...filteredWordDetails.classNames];
            newClassNameArray[activeCharIndex] = name;

            setWordDetails(p => {
                const newWordDetails = [...p];
                newWordDetails[activeWordIndex].classNames = newClassNameArray;
                return newWordDetails;
            });
        } else {
            const name = "wrong";
            const newClassNameArray = [...filteredWordDetails.classNames];
            newClassNameArray[activeCharIndex] = name;

            setWordDetails(p => {
                const newWordDetails = [...p];
                newWordDetails[activeWordIndex].classNames = newClassNameArray;
                return newWordDetails;
            });
        }

        setActiveCharIndex(p => p + 1);
    }

    const c_class = (wi, ci) => {
        const filteredWordDetails = wordDetails.filter((obj) => obj.wordIndex === wi);
        const classname = filteredWordDetails[0]?.classNames[ci];
        return classname;
    }

    const handleValidKeyStroke = (e) => {
        const typedContent = typed + e.key;

        if (typedContent.trim() === "") {
            return;
        }

        const char = typedContent[typedContent.length - 1];
        setTyped(typedContent);
        check(char);
    }

    const handleBackSpace = () => {


        const content = typed.slice(0, -1);
        setTyped(content);
        const newClassNameArray = [...wordDetails[activeWordIndex].classNames];
        newClassNameArray[activeCharIndex - 1] = "character";

        setWordDetails(p => {
            const newWordDetails = [...p];
            newWordDetails[activeWordIndex].classNames = newClassNameArray;
            return newWordDetails;
        })

        if (activeCharIndex === 0) return;
        setActiveCharIndex(p => p - 1);
    }

    const handleSpace = () => {
        setActiveWordIndex(p => p + 1);
        setActiveCharIndex(0);
        setTyped('');
    }

    const handleKeyDown = (e) => {
        if (loseFocus) return;
        // if (timer === 0) return;

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

// currently have to orgnize all of this and delete all the old logic 
// and also have to handle the activeCharIndex out of bounds
// meaning if user typed more words than required then i think in need to somehow show the text();

    return (
        <div
            tabIndex={0}
            ref={placeholderRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="relative transition-all h-[14rem] overflow-hidden mt-16 mb-12 font-code text-3xl text-[#555] p-4 px-12 flex gap-4 text-wrap flex-wrap select-none focus:outline-0"
        >

            <div
                style={{ transform: `translateX(calc(0.55em + ${charRef.current[`${activeWordIndex}-${activeCharIndex-1}`]?.offsetLeft || wordRef.current[activeWordIndex]?.offsetLeft - 20}px))`,
                top: `${wordRef.current[activeWordIndex]?.offsetTop}px`
            }}
                className="absolute left-0 transition-transform top-4 h-10 w-[3px] rounded-3xl bg-yellow-500 animate-blink">
                 {/* {Caret} */}
            </div>

            {wordArray.map((word, wordIndex) => (

                <div
                    ref={(el) => wordRef.current[wordIndex] = el}
                    key={wordIndex}
                    className="flex"
                >
                    {word.split("").map((char, charIndex) => (

                        <span
                            ref={(el) => charRef.current[`${wordIndex}-${charIndex}`] = el}
                            key={`${wordIndex}-${charIndex}`}
                            data-char={char}
                            className={
                                c_class(wordIndex, charIndex) === "correct" ? "text-gray-300"
                                    :
                                    c_class(wordIndex, charIndex) === "wrong" ? "text-red-500" : null
                            }
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