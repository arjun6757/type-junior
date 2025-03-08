import { useRef } from "react";

export const useDomRefs = () => {

    return {
        wpmRef: useRef(null),
        timeRef: useRef(null),
        accuracyRef: useRef(null),
        placeholderRef: useRef(null),
        wordRef: useRef([]),
        charRef: useRef(null),
        loseFocusElementRef: useRef(null),
        caretRef: useRef(null),
    }

};