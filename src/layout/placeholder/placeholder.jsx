import { useEffect, useState, useRef } from "react";
import { words } from "@/helpers/words";

export default function Placeholder() {

    const placeholderRef = useRef(null);
    const [wordArray, setWordArray] = useState([]);
    const [wordDetails, setWordDetails] = useState([]);
    const [typed, setTyped] = useState("");
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [activeCharIndex, setActiveCharIndex] = useState(0);
    const charRef = useRef([]);
    const wordRef = useRef([]);
    const timing = typed.length > 0;

    useEffect(() => {

        setWordArray(words.slice(0, 50));

        if (placeholderRef.current) {
            placeholderRef.current.focus();
        }

    }, []);

    useEffect(() => {

        if (wordArray.length != 0) {
            const newWordDetails = wordArray.map((word, index) => ({
                wordIndex: index,
                chars: word.split(""),
                classNames: word.split("").map(() => "character")
            }))

            setWordDetails(newWordDetails);
        }

    }, [wordArray]);

    // useEffect for handling the scrolling of texts
    useEffect(() => {

        const activeWord = wordRef?.current[activeWordIndex];

        if (activeWord) {
            placeholderRef?.current?.scrollTo({
                top: activeWord?.offsetTop - placeholderRef?.current?.offsetTop + 24,
                behavior: "smooth",
            });
        }

    }, [activeWordIndex]);

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

    return (
        <div
            tabIndex={0}
            ref={placeholderRef}
            // onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="relative transition-all h-[14rem] overflow-hidden mt-5 mb-12 font-code text-3xl text-[#666] px-12 py-4 leading-[1.25em] flex gap-4 text-wrap flex-wrap select-none focus:outline-0"
        >

            <div
                style={{
                    transform: `translateX(calc(0.55em + ${charRef.current[`${activeWordIndex}-${activeCharIndex - 1}`]?.offsetLeft || wordRef.current[activeWordIndex]?.offsetLeft - 20}px))`,
                    top: `${wordRef.current[activeWordIndex]?.offsetTop}px`
                }}
                className={`${ timing > 0 ? "" : "animate-blink" } absolute left-0 transition-transform top-0 h-10 w-1 bg-yellow-300 rounded-lg`}>
                { }
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
                                c_class(wordIndex, charIndex) === "correct" ? "text-[#f0f0f0]"
                                    :
                                    c_class(wordIndex, charIndex) === "wrong" ? "text-red-500" : null
                            }
                        >
                            {char}
                        </span>

                    ))}

                </div>
            ))}
        </div>
    );
}
