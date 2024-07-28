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
    oneCycle: () => void;
    oneCycleState: boolean;
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
   oneCycle: () => {},
   oneCycleState: false,
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
    const[oneCycleState, setOneCycleState] = useState(false);
    const [landedValues, setLandedValues] = useState<{ [key: string]: Value[] }>({});
  


    // useEffect(() => {
    //     const storedWheels = localStorage.getItem('wheels');
    //     const wheels = storedWheels? JSON.parse(storedWheels) : [];
    //     setWheels(wheels);
    //     setLoading(false);
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem('wheels', JSON.stringify(wheels));
    // }, [wheels]);

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
    }, [wheels, randomState, oneCycleState]);

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



    // const addWheel = useCallback((inputValue: string) => {
    //     try {
    //         // retrieve existing wheels from localStorage
    //         const storedWheels = localStorage.getItem('wheels');
    //         const wheels = storedWheels ? JSON.parse(storedWheels) : [];
    
    //         // create a new wheel object
    //         const newWheel = { id: uuidv4(), title: inputValue, values: [], isRandom: false, cycleOnce: false };
    
    //         // add the new wheel to the list of wheels
    //         const updatedWheels = [...wheels, newWheel];
    
    //         // save the updated wheels list back to localStorage
    //         localStorage.setItem('wheels', JSON.stringify(updatedWheels));
    
    //         // update the state with the new wheels list
    //         setWheels(updatedWheels);
    //     } catch (error) {
    //         console.error('There is an error adding the wheel title');
    //     }
    // }, []);


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

// const addValue = useCallback((wheel_id: string, value: string) => {
//     try {
//         // Retrieve wheels from localStorage
//         const storedWheels = localStorage.getItem('wheels');
//         const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

//         // Create a new value
//         const newValue: Value = { id: uuidv4(), value, wheel_id };

//         // Find the wheel to update and add the new value
//         const updatedWheels = wheels.map(wheel => 
//             wheel.id === wheel_id 
//                 ? { ...wheel, values: [...wheel.values, newValue] } 
//                 : wheel
//         );

//         // Save the updated wheels list back to localStorage
//         localStorage.setItem('wheels', JSON.stringify(updatedWheels));
//     } catch (error) {
//         console.error("Error adding value:", error);
//     }
// }, []);

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

// const updateWheel = useCallback((wheel_id: string, title: string) => {
//     try{
//     const storedWheels = localStorage.getItem("wheels");
//     const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

//     const updatedWheels = wheels.map(wheel => {
//         wheel.id === wheel_id ? {...wheel, title, } : wheel
//     });

//     localStorage.setItem('wheels', JSON.stringify(updatedWheels))
    
// } catch (error) {
//     console.error("Error updating wheel titles:", error);
// }
// }, []);

const updateWheel = useCallback((wheel_id: string, title: string) => {
    try {
        // Retrieve wheels from localStorage
        const storedWheels = localStorage.getItem('wheels');
        const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

        // Update the wheel with the new title and randomState
        const updatedWheels = wheels.map(wheel => {
            if (wheel.id === wheel_id) {
                return { ...wheel, title, isRandom: randomState, oneCycle: oneCycleState }; // Update the wheel with randomState
            }
            return wheel;
        });

        // Save the updated wheels list back to localStorage
        setWheels(updatedWheels);
        localStorage.setItem('wheels', JSON.stringify(updatedWheels));
    } catch (error) {
        console.error("Error updating wheel:", error);
    }
}, [randomState]);
console.log("ROOOOOOOOOO", randomState)




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

        // Save the updated wheels list back to localStorage
        localStorage.setItem('wheels', JSON.stringify(updatedWheels));
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

    // const random = useCallback(() => {
      
    //     setRandomState(prevState => !prevState);
       
    // }, []);

    const random = useCallback(() => {
        setRandomState(prevState => !prevState);
        setWheels(prevWheels => {
            const updatedWheels = prevWheels.map(wheel => ({
                ...wheel,
                isRandom: !randomState,
            }));
            console.log('Random state toggled. Updated wheels:', updatedWheels);
            return updatedWheels;
        });
    }, [randomState]);
    
    const oneCycle = useCallback(() => {
        setOneCycleState(prevState => !prevState);
        setWheels(prevWheels => {
            const updatedWheels = prevWheels.map(wheel => ({
                ...wheel,
                oneCycle: !oneCycleState,
            }))
            console.log("one cycle toggled updated wheels")
            return updatedWheels
        })
    }, [])

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
        oneCycle,
        oneCycleState,
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
