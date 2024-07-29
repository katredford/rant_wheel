// WheelProvider.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useReducer } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import { useParams } from 'react-router-dom';
import { Wheel, Value } from './types';



//hold an array of wheels so we can manage and update multiple
interface WheelContextType {
    wheels: Wheel[];
    loading: boolean;
    oneWheel: Wheel | null;
    values: Value[];
    getOneWheel: (id: string) => void
    addWheel: (input: string) => void
    updateWheel: (wheel_id: string, value: string) => void
    addValue: (wheel_id: string, value: string) => void
    updateValue: (wheel_id: string, value_id: string, value: string) => void
    deleteValue: (wheel_id: string, value_id: string) => Promise<void>;
    triggerSpinAnimation: () => void;
    spinAnimationTriggered: boolean;
    randomState: boolean
    random: () => void;
    cycleOnce: () => void;
   cycleOnceState: boolean;
    landedValues: { [key: string]: Value[] }; // Track landed values by wheel ID
    addLandedValue: (wheel_id: string, value: Value) => void;
    clearLandedValues: (wheel_id: string) => void;

}

export const WheelContext = createContext<WheelContextType>({
    wheels: [],
    loading: true,
    oneWheel: null,
    values: [],
    getOneWheel: () => {},
    addWheel: () => {},
    updateWheel: () => {},
    addValue: () => {},
    updateValue: () => {},
    deleteValue: async () => {},
    triggerSpinAnimation: () => {},
    spinAnimationTriggered: false,
    randomState: false,
    random: () => {},
   cycleOnce: () => {},
   cycleOnceState: false,
   landedValues: {},
   addLandedValue: () => {},
   clearLandedValues: () => {},
    // newValues: state.values,
});


export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wheels, setWheels] = useState<Wheel[]>([]);
    const [oneWheel, setOneWheel] = useState<Wheel | null>(null);
    const [loading, setLoading] = useState(false);
    const [spinAnimationTriggered, setSpinAnimationTriggered] = useState(false);
    const[randomState, setRandomState] = useState(false);
    const[cycleOnceState, setCycleOnceState] = useState(false);
    const [landedValues, setLandedValues] = useState<{ [key: string]: Value[] }>({});
  




    useEffect(() => {
        const storedWheels = localStorage.getItem('wheels');
        const wheels = storedWheels ? JSON.parse(storedWheels) : [];
        console.log('useEffect - Load wheels from localStorage:', wheels);
        setWheels(wheels);
        setLoading(false);
    }, []);

    useEffect(() => {
        console.log('useEffect - Saving wheels to localStorage:', wheels);
        localStorage.setItem('wheels', JSON.stringify(wheels));
    }, [wheels, randomState, cycleOnceState]);

    //useCallback is to memoize
    // memoization is the process of caching the result of a function call and 
    // returning the cached result when the same inputs occur again, rather than 
    // recalculating the result
    const getAllWheels = useCallback(async () => {
        try {
            const storedWheels = localStorage.getItem('wheels');
            const wheels = storedWheels ? JSON.parse(storedWheels) : [];

            const wheelsWithValues = wheels.map((wheel: any) => ({
                ...wheel,
                values: wheel.values || [],
            }))
            setWheels(wheelsWithValues);
        } catch (error) {
            console.error('There was an error fetching the wheels data!', error);
        } finally {
            setLoading(false);
        }
    }, []);



    const getOneWheel = useCallback(async (id: string) => {
        setLoading(true);
    
        try {
            // Retrieve wheels from localStorage
            const storedWheels = localStorage.getItem('wheels');
            const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];
    
            // Find the wheel with the given id
            const oneWheel = wheels.find((wheel) => wheel.id === id) || null;
    
    
            // Set the found wheel to state
            setOneWheel(oneWheel);
        } catch (error) {
            console.error("Error getting one wheel data:", error);
        } finally {
            // Set loading state to false
            setLoading(false);
        }
    }, []);






    const addWheel = useCallback((inputValue: string) => {
        try {
            const newWheel = { id: uuidv4(), title: inputValue, values: [], isRandom: false, cycleOnce: false };
            setWheels(prevWheels => {
                const updatedWheels = [...prevWheels, newWheel];
                console.log('Adding wheel:', newWheel);
                console.log('Updated wheels:', updatedWheels);
                return updatedWheels;
            });
        } catch (error) {
            console.error('There is an error adding the wheel title', error);
        }
    }, []);



const addValue = useCallback((wheel_id: string, value: string) => {
    try {
        const newValue: Value = { id: uuidv4(), value, wheel_id };
        setWheels(prevWheels => {
            const updatedWheels = prevWheels.map(wheel =>
                wheel.id === wheel_id ? { ...wheel, values: [...wheel.values, newValue] } : wheel
            );
            console.log('Adding value:', newValue);
            console.log('Updated wheels:', updatedWheels);
            return updatedWheels;
        });
    } catch (error) {
        console.error("Error adding value:", error);
    }
}, []);


console.log("ROOOOOOOOOO", randomState)
const updateWheel = useCallback((wheel_id: string, title: string, updates: Partial<Wheel>) => {
    try {
        const storedWheels = localStorage.getItem('wheels');
        const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

        const updatedWheels = wheels.map(wheel => 
            wheel.id === wheel_id ? { ...wheel, title, ...updates } : wheel
        );

        setWheels(updatedWheels);
        localStorage.setItem('wheels', JSON.stringify(updatedWheels));
    } catch (error) {
        console.error("Error updating wheel:", error);
    }
}, []);



const updateValue = useCallback((wheel_id: string, value_id: string, newValue: string) => {
    try {
        // Retrieve wheels from localStorage
        const storedWheels = localStorage.getItem('wheels');
        const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

        // Find the wheel to update
        const updatedWheels = wheels.map(wheel => {
            if (wheel.id === wheel_id) {
                // Find and update the value within the wheel
                const updatedValues = wheel.values.map(value => 
                    value.id === value_id ? { ...value, value: newValue } : value
                );
                return { ...wheel, values: updatedValues };
            }
            return wheel;
        });
        console.log("UDATGE UPDATE UPDATE", updatedWheels)
        // Save the updated wheels list back to localStorage
        // localStorage.setItem('wheels', JSON.stringify(updatedWheels));
        setWheels(updatedWheels);
    } catch (error) {
        console.error("Error updating value:", error);
    }
}, []);

 

    const deleteValue = useCallback((wheel_id: string, value_id: string) => {
        return new Promise<void>((resolve, reject) => {
            try {
                // Retrieve wheels from localStorage
                const storedWheels = localStorage.getItem('wheels');
                const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];
    
                // Find the wheel to update
                const updatedWheels = wheels.map(wheel => {
                    if (wheel.id === wheel_id) {
                        // Filter out the value to delete within the wheel
                        const updatedValues = wheel.values.filter(value => value.id !== value_id);
                        return { ...wheel, values: updatedValues };
                    }
                    return wheel;
                });
    
                // Save the updated wheels list back to localStorage
                localStorage.setItem('wheels', JSON.stringify(updatedWheels));
                console.log("Deleted value successfully");
    
                resolve();
            } catch (error) {
                console.error("Error deleting value:", error);
                reject(error);
            }
        });
    }, []);

    const triggerSpinAnimation = useCallback(() => {
        setSpinAnimationTriggered(true);
        setTimeout(() => setSpinAnimationTriggered(false), 1000);
    }, []);




const random = useCallback(() => {
    setRandomState(prevState => {
        const newState = !prevState;
        setWheels(prevWheels => {
            const updatedWheels = prevWheels.map(wheel => ({
                ...wheel,
                isRandom: newState,
            }));
            return updatedWheels;
        });
        return newState;
    });
}, []);

const cycleOnce = useCallback(() => {
    setCycleOnceState(prevState => {
        const newState = !prevState;
        setWheels(prevWheels => {
            const updatedWheels = prevWheels.map(wheel => ({
                ...wheel,
                cycleOnce: newState,
            }));
            return updatedWheels;
        });
        return newState;
    });
}, []);

    const addLandedValue = useCallback((wheel_id: string, value: Value) => {
        setLandedValues(prevState => ({
            ...prevState,
            [wheel_id]: [...(prevState[wheel_id] || []), value],
        }));
    }, []);

    console.log("add landed values", landedValues)
    const clearLandedValues = useCallback((wheel_id: string) => {
        setLandedValues(prevState => ({
            ...prevState,
            [wheel_id]: [],
        }));
    }, []);
   

  

    // useEffect(() => {
    //     getAllWheels();
    // }, [getAllWheels]);


    const actions = {
        wheels,
        oneWheel,
        loading,
        getOneWheel,
        addWheel,
        updateWheel,
        addValue,
        updateValue,
        deleteValue,
        spinAnimationTriggered,
        triggerSpinAnimation,
        random,
        randomState,
        cycleOnce,
        cycleOnceState,
        landedValues,
        addLandedValue,
        clearLandedValues,
    }

    return (
        <WheelContext.Provider value={actions}>
            {children}
        </WheelContext.Provider>
    );
};
