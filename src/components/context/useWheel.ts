import { useContext } from 'react'
import { WheelContext} from "./WheelContext"



// Create a custom hook to use the WheelContext
export const useWheel = () => {
    const context = useContext(WheelContext);
    if (context === undefined) {
        throw new Error('something went wrong with useWheel.ts');
    }
    return context;
};