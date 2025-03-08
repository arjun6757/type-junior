import { MousePointerIcon } from "@/components/Icons";
import { useAllRefs, useAllStates } from "@/context/typeprovider";

export default function LoseFocus() {

    const { loseFocusElementRef } = useAllRefs();
    const { loseFocus, setLoseFocus } = useAllStates();

    return (
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
            <MousePointerIcon />
            <span>Click here or press any key to focus</span>
        </div>
    )
} 