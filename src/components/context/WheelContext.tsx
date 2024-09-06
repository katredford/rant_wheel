// WheelProvider.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { useParams } from 'react-router-dom';
import { Wheel, Value, Color, Image } from './types';

// Default color values
const defaultColor: Color = {
    textColor: "#000000",
    sliceColor: "#ff0000",
    strokeColor: "#ddd"
};

// Default image values
const defaultImage: Image = {
    id: uuidv4(),
    x: 0,
    y: 0,
    rotation: 0,
    width: 0,
    height: 0,
    src: ""
};

//hold an array of wheels so we can manage and update multiple
interface WheelContextType {
    wheels: Wheel[];
    loading: boolean;
    oneWheel: Wheel | null;
    // values: Value[];
    getOneWheel: (id: string) => void
    addWheel: (input: string) => void
    // updateWheel: (wheel_id: string, value: string) => void
    updateWheel: (wheel_id: string, title: string, updates?: Partial<Wheel>) => void;
    addValue: (wheel_id: string, value: string) => void
    // updateValue: (wheel_id: string, value_id: string, value: string) => void

    updateValue: (wheel_id: string, value_id: string, newValue?: string, newColor?: Color) => void;
    deleteValue: (wheel_id: string, value_id: string) => Promise<void>;
    triggerSpinAnimation: () => void;
    spinAnimationTriggered: boolean;
    landedValues: { [key: string]: Value[] }; 
    addLandedValue: (wheel_id: string, value: Value) => void;
    clearLandedValues: (wheel_id: string) => void;
    refreshWheelData: () => void;
    refreshTrigger: boolean;
  

}

export const WheelContext = createContext<WheelContextType>({
    wheels: [],
    loading: true,
    oneWheel: null,
    // values: [],
    getOneWheel: () => { },
    addWheel: () => { },
    updateWheel: () => { },
    addValue: () => { },
    updateValue: () => { },
    deleteValue: async () => { },
    triggerSpinAnimation: () => { },
    spinAnimationTriggered: false,

    landedValues: {},
    addLandedValue: () => { },
    clearLandedValues: () => { },
    refreshWheelData: () => { },
    refreshTrigger: false,
    // updateColor: () => { }
    // newValues: state.values,
});


export const WheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wheels, setWheels] = useState<Wheel[]>([]);
    const [oneWheel, setOneWheel] = useState<Wheel | null>(null);
    const [loading, setLoading] = useState(false);
    const [spinAnimationTriggered, setSpinAnimationTriggered] = useState(false);

    const [landedValues, setLandedValues] = useState<{ [key: string]: Value[] }>({});


    const prevOneWheelRef = useRef<Wheel | null>(null);

    const [refreshTrigger, setRefreshTrigger] = useState(false); // Add this line

    const refreshWheelData = useCallback(() => {

        setRefreshTrigger(prev => !prev); // Toggle the refreshTrigger state
    }, []);


    useEffect(() => {
        const storedWheels = localStorage.getItem('wheels');
        const wheels = storedWheels ? JSON.parse(storedWheels) : [];

        setWheels(wheels);
        setLoading(false);
    }, []);

    // useEffect(() => {
    //     localStorage.setItem('wheels', JSON.stringify(wheels));
    // }, [wheels]);

    useEffect(() => {
        localStorage.setItem('wheels', JSON.stringify(wheels));
        // Only refresh if there's a specific condition met
        if (wheels.length > 0) {
            refreshWheelData();
        }
    }, [wheels, refreshWheelData]);

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
            const newWheel = { id: uuidv4(), title: inputValue, values: [], isRandom: false, cycleOnce: false, strokeColor: "#000000", strokeWidth: 4 };
            setWheels(prevWheels => {
                const updatedWheels = [...prevWheels, newWheel];
                return updatedWheels;
            });
        } catch (error) {
            console.error('There is an error adding the wheel title', error);
        }
    }, []);


    const addValue = useCallback((wheel_id: string, value: string) => {
        try {
            const newValue: Value = {
                id: uuidv4(),
                value,
                wheel_id,
                color: defaultColor,
                imgSrc: defaultImage
            };
            setWheels(prevWheels => {
                const updatedWheels = prevWheels.map(wheel =>
                    wheel.id === wheel_id ? { ...wheel, values: [...wheel.values, newValue] } : wheel
                );
                localStorage.setItem('wheels', JSON.stringify(updatedWheels));
                return updatedWheels;
            });
        } catch (error) {
            console.error("Error adding value:", error);
        }
    }, [setWheels]);

    const updateWheel = useCallback((wheel_id: string, title: string, updates?: Partial<Wheel>) => {
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




    // const updateValue = useCallback((wheel_id: string, value_id: string, newValue?: string, color?: Color) => {
    //     try {
    //         const updatedWheels = wheels.map(wheel => {
    //             if (wheel.id === wheel_id) {
    //                 const updatedValues = wheel.values.map(value =>
    //                     value.id === value_id ? { ...value, value: newValue, color } : value
    //                 );
    //                 return { ...wheel, values: updatedValues };
    //             }
    //             return wheel;
    //         });

    //         localStorage.setItem('wheels', JSON.stringify(updatedWheels));
    //         setWheels(updatedWheels);
    //     } catch (error) {
    //         console.error("Error updating value:", error);
    //     }
    // }, [wheels]);

    const updateValue = useCallback((wheel_id: string, value_id: string, newValue?: string, newColor?: Color) => {
        try {
            const updatedWheels = wheels.map(wheel => {
                if (wheel.id === wheel_id) {
                    const updatedValues = wheel.values.map(value =>
                        value.id === value_id
                            ? { ...value, value: newValue, color: newColor || value.color } // Use the Color object
                            : value
                    );
                    return { ...wheel, values: updatedValues };
                }
                return wheel;
            });
    
            localStorage.setItem('wheels', JSON.stringify(updatedWheels));
            setWheels(updatedWheels);
        } catch (error) {
            console.error("Error updating value:", error);
        }
    }, [wheels]);
    


    // const updateColor = (wheel_id: string, value_id: string, newColor: Color) => {
    //     const updatedWheels = wheels.map(wheel => {
    //         if (wheel.id === wheel_id) {
    //             const updatedValues = wheel.values.map(value => {
    //                 if (value.id === value_id) {
    //                     return { ...value, color: newColor };
    //                 }
    //                 return value;
    //             });
    //             return { ...wheel, values: updatedValues };
    //         }
    //         return wheel;
    //     });
    //     setWheels(updatedWheels);
    //     localStorage.setItem('wheels', JSON.stringify(updatedWheels));
    // };

    const deleteValue = useCallback((wheel_id: string, value_id: string) => {
        return new Promise<void>((resolve, reject) => {
            try {
                // retrieve wheels from localStorage
                const storedWheels = localStorage.getItem('wheels');
                const wheels: Wheel[] = storedWheels ? JSON.parse(storedWheels) : [];

                // find the wheel to update
                const updatedWheels = wheels.map(wheel => {
                    if (wheel.id === wheel_id) {
                        // filter out the value to delete within the wheel
                        const updatedValues = wheel.values.filter(value => value.id !== value_id);
                        return { ...wheel, values: updatedValues };
                    }
                    return wheel;
                });

                // save the updated wheels list back to localStorage
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






    const addLandedValue = useCallback((wheel_id: string, value: Value) => {
        setLandedValues(prevState => ({
            ...prevState,
            [wheel_id]: [...(prevState[wheel_id] || []), value],
        }));
    }, []);


    const clearLandedValues = useCallback((wheel_id: string) => {
        setLandedValues(prevState => ({
            ...prevState,
            [wheel_id]: [],
        }));
    }, []);






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
        landedValues,
        addLandedValue,
        clearLandedValues,
        refreshWheelData,
        // values: oneWheel?.values || [],
        refreshTrigger,
        // updateColor
        //     refresh
    }

    return (
        <WheelContext.Provider value={actions}>
            {children}
        </WheelContext.Provider>
    );
};
