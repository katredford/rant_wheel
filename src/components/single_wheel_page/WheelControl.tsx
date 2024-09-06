
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useWheel } from '../context/useWheel';
import ValuesControl from './ValuesControl';
import AddValueForm from './AddValueForm';
import PortalContainer from './PortalContainer';
import WheelComponent from '../wheel/WheelComponent';
import { Toaster } from 'react-hot-toast'
import { SiStarship } from 'react-icons/si'
import { motion } from 'framer-motion'
import { Input } from '../Input'

import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { toast } from 'react-hot-toast'
import cn from 'classnames'
import { Switch, Group } from '@mantine/core';
import classes from './CustomSwitch.module.css';
import useLocalStorageListener from '../hooks/useLocalStorageListener';


const WheelControl: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        oneWheel, 
        loading, 
        getOneWheel, 
        updateWheel, 
        updateValue, 
        deleteValue, 
        triggerSpinAnimation, 
        landedValues, 
        clearLandedValues, 
        refreshTrigger,
        // updateColor
    } = useWheel();

    const [isPortalOpen, setIsPortalOpen] = useState(false);
    const [isTriggerDisabled, setIsTriggerDisabled] = useState(false);


    const [editingWheelId, setEditingWheelId] = useState<string| null>(null);
    //holds edited value
    const [editedWheel, setEditedWheel] = useState<string>('');
   
    const editInputRef = useRef<HTMLInputElement>(null)
    const refreshWheelData = () => {
   
        getOneWheel(String(id));
    };

    // Listen for changes to the specific wheel in local storage
  
    useEffect(() => {
        // This effect will run whenever refreshTrigger changes
     
    
        // Add any logic needed to refresh the WheelControl component here
        getOneWheel(String(id));
    }, [refreshTrigger, id, getOneWheel]);

    useEffect(() => {
        getOneWheel(String(id));
    }, [id, getOneWheel]);

    useEffect(() => {
        if(oneWheel && landedValues[oneWheel.id]?.length === oneWheel.values.length) {
            setIsTriggerDisabled(true);
        }else {
            setIsTriggerDisabled(false);
        }
    }, [landedValues, oneWheel]);

   

    const handleOpenPortal = () => {
        setIsPortalOpen(true);
    };

    const handleClosePortal = () => {
        setIsPortalOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!oneWheel) {
        return <div>Wheel not found</div>;
    }


    const handleEditStart = (wheelId: string, originalValue: string) => {
        setEditingWheelId(wheelId);
        setEditedWheel(originalValue);

        if (editInputRef.current) {
            editInputRef.current.focus()
        }

    };

    const handleUpdate = ( wheelId: string) => {
        if (editedWheel.trim() !== '') {
            updateWheel(wheelId, editedWheel)
            refreshWheelData();

            //reset state
            setEditingWheelId(null);
            setEditedWheel('');
            toast.success('Wheel updated successfully!')
        } else {
            toast.error('Wheel field cannot be empty!')
        }
    }



    const handleSwitchChange = (type: 'random' | 'cycleOnce', checked: boolean) => {
        if (type === 'random') {
            updateWheel(oneWheel.id, oneWheel.title, { ...oneWheel, isRandom: checked });
        } else if (type === 'cycleOnce') {
            updateWheel(oneWheel.id, oneWheel.title, { ...oneWheel, cycleOnce: checked });
        }
    };
    return (
        <>
         <Toaster position="bottom-center" />


<motion.h1
                className="p-5 rounded-xl bg-zinc-900"
                key={oneWheel?.id}
            >
                {editingWheelId === oneWheel?.id ? (
                    <motion.div
                        layout
                        key={oneWheel?.id}
                        className="flex gap-2"
                    >
                        <Input
                            ref={editInputRef}
                            type="text"
                            value={editedWheel}
                            onChange={e => setEditedWheel(e.target.value)}
                        />
                        <button
                            className="px-5 py-2 text-sm font-normal text-orange-300 bg-orange-900 border-2 border-orange-900 active:scale-95 rounded-xl"
                            onClick={() => handleUpdate(oneWheel.id)}
                        >
                            Save
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <motion.span layout>
                            <span>{oneWheel?.title}</span>
                        </motion.span>
                        <div className="flex justify-between gap-5 text-white">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditStart(oneWheel.id, oneWheel.title)}
                                    className="flex items-center gap-1"
                                >
                                    <FaRegEdit />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.h1>



           
            <AddValueForm wheel_id={String(id)} onValueAdded={refreshWheelData} />
            {oneWheel.values && oneWheel.values.length > 0 ? (
                <>
                    <ValuesControl
                        wheel={oneWheel}
                        onUpdateValue={(wheelId, valueId, value, color) => {
                            updateValue(wheelId, valueId, value, color);
                            refreshWheelData();
                        }}
                        onValueChanged={refreshWheelData}
                        deleteValue={(wheelId, valueId) => {
                            deleteValue(wheelId, valueId).then(refreshWheelData);
                        }}
                        // updateColor={updateColor}
                        updateValue={(wheelId, valueId, newColor) => {
                            updateValue(wheelId, valueId, newColor);
                            refreshWheelData();
                        }}
                    />

                    <button onClick={triggerSpinAnimation} disabled={isTriggerDisabled}>
                        Trigger Animation
                        </button>
                </>
            ) : (

                <div className="max-w-lg px-5 m-auto">
                    <h1 className="flex flex-col items-center gap-5 px-5 py-10 text-xl font-bold text-center rounded-xl bg-zinc-900">
                        <SiStarship className="text-5xl" />
                        add values to  your wheel
                    </h1>
                </div>
            )
            }



            <Switch
    label="Random"
    classNames={classes}
    checked={oneWheel.isRandom || false}
    onChange={(e) => handleSwitchChange('random', e.currentTarget.checked)}
/>
<Switch
    label="Cycle once"
    classNames={classes}
    checked={oneWheel.cycleOnce || false}
    onChange={(e) => handleSwitchChange('cycleOnce', e.currentTarget.checked)}
/>

            <button onClick={handleOpenPortal}>Open Portal</button>
            <button onClick={handleClosePortal}>Close Portal</button>
            {isPortalOpen && (
                <PortalContainer >
                    <WheelComponent />
                </PortalContainer>
            )}

            <WheelComponent />

        </>
    );
};

export default WheelControl;











