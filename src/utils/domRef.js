import { useRef } from "react";

export function useDomRefs() {
    return {
        wpmRef: useRef(null),
        timeRef: useRef(null),
        accuracyRef: useRef(null),
        placeholderRef: useRef(null)
    }
}