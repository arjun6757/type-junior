import { useDomRefs } from "@/helpers/refs";
import { TypeContext } from "./typecontext";
import { useContext, useEffect, useState } from "react";

export default function TypeProvider({ children }) {

    const
        {
            wpmRef, timeRef,
            accuracyRef, placeholderRef,
            wordRef, loseFocusElementRef,
            caretRef
        } = useDomRefs();

    const [rightOnes, setRightOnes] = useState([]);
    const [typed, setTyped] = useState('');
    const [randomWords, setRandomWords] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [classNames, setClassNames] = useState([]);
    const [wordClasses, setWordClasses] = useState([]);
    const [caretPosition, setCaretPosition] = useState(0);
    const [loseFocus, setLoseFocus] = useState(false);
    const [timer, setTimer] = useState(30);
    const [typing, setTyping] = useState(false);
    const [initial, setInital] = useState(0);

    useEffect(() => {
        if (placeholderRef.current) {
            const activeWord = wordRef.current[activeIndex];
            if (activeWord) {
                placeholderRef.current.scrollTo({
                    top: activeWord.offsetTop - placeholderRef.current.offsetTop + 4,
                    behavior: "smooth",
                });
            }
        }
    }, [activeIndex]);

    return (
        <TypeContext.Provider
            value={{
                refs: {
                    wpmRef, timeRef,
                    accuracyRef, placeholderRef,
                    wordRef, loseFocusElementRef,
                    caretRef
                },
                state: {
                    rightOnes, setRightOnes,
                    typed, setTyped,
                    randomWords, setRandomWords,
                    activeIndex, setActiveIndex,
                    classNames, setClassNames,
                    wordClasses, setWordClasses,
                    caretPosition, setCaretPosition,
                    loseFocus, setLoseFocus,
                    timer, setTimer,
                    typing, setTyping,
                    initial, setInital
                }
            }}>
            {children}
        </TypeContext.Provider>
    )
}

export function useAllStates() {
    return useContext(TypeContext).state;
}

export function useAllRefs() {
    return useContext(TypeContext).refs;
}