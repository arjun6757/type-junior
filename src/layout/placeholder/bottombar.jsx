import { RotateClockWiseIcon } from "@/components/Icons";

export default function Bottombar({ handleReset }) {
    return (

        <div className="max-w-fit mx-auto mt-12">

            <button onClick={handleReset} className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]">
                <RotateClockWiseIcon className="h-4 w-4 group-hover:text-gray-100 group-focus:rotate-180 transition-transform duration-500" />
            </button>

        </div>
    );
}