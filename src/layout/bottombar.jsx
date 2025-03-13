import { RotateClockWiseIcon } from "@/components/Icons";

export default function Bottombar() {

    return (

        <div className="max-w-fit mx-auto mt-12">

            <button
                type="button"
                // onClick={handleReset}
                className="group bg-transparent focus-visible:outline-2 focus-visible:outline-gray-300 px-4 py-2 rounded cursor-pointer text-[#888]"
            >
                <RotateClockWiseIcon
                    className="h-6 w-6 fill-[#666]"
                />
            </button>

        </div>
    );
}