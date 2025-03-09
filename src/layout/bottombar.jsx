import { RotateClockWiseIcon } from "@/components/Icons";
import { useAllStates } from "@/context/typeprovider";
import { shuffle } from "@/helpers/helper";

export default function Bottombar() {

    const
        {
            setTyped, setRightOnes,
            setActiveIndex, setClassNames,
            setWordClasses, setCaretPosition,
            setLoseFocus, setTimer,
            setTyping, randomWords,
            setRandomWords
        }
            = useAllStates();

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

        <div className="max-w-fit mx-auto mt-12">

            <button
                type="button"
                onClick={handleReset}
                className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]"
            >
                <RotateClockWiseIcon
                    className="h-4 w-4 group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500"
                />
            </button>

        </div>
    );
}