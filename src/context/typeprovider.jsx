import { useDomRefs } from "@/helpers/refs";
import { TypeContext } from "./typecontext";
import { useContext, useEffect, useState } from "react";

export default function TypeProvider({ children }) {

    const
        {
            wpmRef, timeRef,
            accuracyRef, placeholderRef,
            wordRef, loseFocusElementRef,
        } = useDomRefs();

    const [rightOnes, setRightOnes] = useState([]);
    const [typed, setTyped] = useState('');
    const [randomWords, setRandomWords] = useState([]);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [activeCharIndex, setActiveCharIndex] = useState(0);
    const [charClasses, setCharClasses] = useState([]);
    const [loseFocus, setLoseFocus] = useState(false);
    const [timer, setTimer] = useState(30);
    const [typing, setTyping] = useState(false);
    const [initial, setInital] = useState(0);

    // useEffect(() => {
    //     if (placeholderRef.current) {
    //         const activeWord = wordRef.current[activeIndex];
    //         if (activeWord) {
    //             placeholderRef.current.scrollTo({
    //                 top: activeWord.offsetTop - placeholderRef.current.offsetTop + 16,
    //                 behavior: "smooth",
    //             });
    //         }
    //     }
    // }, [activeIndex]);

    return (
        <TypeContext.Provider
            value={{
                refs: {
                    wpmRef, timeRef,
                    accuracyRef, placeholderRef,
                    wordRef, loseFocusElementRef,
                },
                state: {
                    rightOnes, setRightOnes,
                    typed, setTyped,
                    randomWords, setRandomWords,
                    activeWordIndex, setActiveWordIndex,
                    activeCharIndex, setActiveCharIndex,
                    charClasses, setCharClasses,
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