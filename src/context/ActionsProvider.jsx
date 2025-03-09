import { createContext, useContext } from "react";
import { useState } from "react";
export const ActionsContext = createContext(null);

export default function ActionsProvider ({ children })  {
    
    const [words, setWords] = useState([]);

    return (
        <ActionsContext.Provider value={{ words, setWords }}>
            {children}
        </ActionsContext.Provider>
    )
}

export function useActions() {
    return useContext(ActionsContext);
}