
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../Input';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import cn from 'classnames';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Text } from '@mantine/core';
import { Wheel, Value } from '../context/types';
import "./singleWheel.css"
import { Color } from '../context/types'

interface ValuesControlProps {
    wheel?: Wheel;
    onValueChanged: () => void;
    onUpdateValue: (wheel_id: string, value_id: string, new_value: string, colors: { sliceColor: string, textColor: string }) => void;
    deleteValue: (wheel_id: string, value_id: string) => void;
    updateValue: (wheel_id: string, value_id: string, newValue?: string, newColor?: Color) => void;

}

const ValuesControl: React.FC<ValuesControlProps> = ({ wheel, onUpdateValue, deleteValue, updateValue }) => {
    const [editingValueId, setEditingValueId] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [values, setValues] = useState<Value[]>([]);
    const editInputRef = useRef<HTMLInputElement>(null);
    const [showOptions, setShowOptions] = useState<string | null>(null);

    useEffect(() => {
        if (editingValueId !== null && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingValueId]);

    useEffect(() => {
        if (wheel) {
            const storedOrder = localStorage.getItem(`wheel-${wheel.id}-order`);
            if (storedOrder) {
                const order = JSON.parse(storedOrder);
                const orderedValues = order.map((id: string) => wheel.values.find((v) => v.id === id));
                setValues(orderedValues.filter(v => v !== undefined) as Value[]);
            } else {
                setValues(wheel.values);
            }
        }
    }, [wheel]);

    useEffect(() => {
        if (wheel) {
            setValues(wheel.values);
        }
    }, [wheel, wheel?.values]);

    const handleEditStart = (valueId: string, originalValue: string) => {
        setEditingValueId(valueId);
        setEditedValue(originalValue);
        if (editInputRef.current) {
            editInputRef.current.focus();
        }
    };

    // const handleUpdate = (valueId: string, wheelId: string, colors?: Color) => {
    //     const defaultColors = { sliceColor: '#ff0000', textColor: '#000000' };

    //     const { sliceColor = defaultColors.sliceColor, textColor = defaultColors.textColor } = colors || {};
    //     if (editedValue.trim() !== '') {
    //         onUpdateValue(wheelId, valueId, editedValue, { sliceColor, textColor });
    //         setEditingValueId(null);
    //         setEditedValue('');

    //         setShowOptions(null);
    //         toast.success('Value updated successfully!');
    //     } else {
    //         toast.error('Value field cannot be empty!');
    //     }
    // };

    const handleUpdate = (valueId: string, wheelId: string, colors?: Color) => {
        console.log('Received colors:', colors);
        const defaultColors = { sliceColor: '#ff0000', textColor: '#000000' };
    
        const { sliceColor = defaultColors.sliceColor, textColor = defaultColors.textColor } = colors || {};
        if (editedValue.trim() !== '') {
            onUpdateValue(wheelId, valueId, editedValue, { sliceColor, textColor });
            setEditingValueId(null);
            setEditedValue('');
            setShowOptions(null);
            toast.success('Value updated successfully!');
        } else {
            toast.error('Value field cannot be empty!');
        }
    };

    const handleDelete = (wheelId: string, valueId: string) => {
        deleteValue(wheelId, valueId);
        toast.success('Value deleted successfully!');
    };

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const reorderedValues = Array.from(values);
        const [movedItem] = reorderedValues.splice(source.index, 1);
        reorderedValues.splice(destination.index, 0, movedItem);

        setValues(reorderedValues);

        if (wheel) {
            const updatedWheels = JSON.parse(localStorage.getItem('wheels') || '[]') as Wheel[];
            const updatedWheelsWithNewOrder = updatedWheels.map(w => {
                if (w.id === wheel.id) {
                    return { ...w, values: reorderedValues };
                }
                return w;
            });
            localStorage.setItem('wheels', JSON.stringify(updatedWheelsWithNewOrder));
        }
    };


    // const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, valueId: string, wheelId: string, colorType: keyof Color) => {
    //     const newColor = e.target.value;
    //     console.log(newColor, valueId)
    //     const currentValue = values.find(v => v.id === valueId);
    //     console.log(currentValue)
    //     if (currentValue) {
    //         console.log("UPDATE UPDATE")
    //         updateValue(wheelId, valueId, currentValue.value, { ...currentValue.color, [colorType]: newColor });
            
    //     }
    // };

    // const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, valueId: string, wheelId: string, colorType: keyof Color) => {
    //     const newColor = e.target.value;
    //     console.log(newColor, valueId);
        
    //     const currentValue = values.find(v => v.id === valueId);
    //     console.log( "current value ",currentValue);
    
    //     if (currentValue) {
    //         console.log("UPDATE UPDATE");
    
    //         // Create a new color object based on the current color and the updated color
    //         const updatedColor = {
    //             ...currentValue.color,
    //             [colorType]: newColor
    //         };

    //         console.log(currentValue, "CURRENT VALUD")
    
    //         // Call updateValue with the new color
    //         updateValue(wheelId, valueId, currentValue.value, updatedColor);
    //     }
    // };
    
    // const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, valueId: string, wheelId: string, colorType: keyof Color) => {
    //     const newColor = e.target.value;
    //     console.log("New Color:", newColor, "Value ID:", valueId);
    
    //     // Find the current value based on valueId
    //     const currentValue = values.find(v => v.id === valueId);
    //     console.log("Current Value:", currentValue);
        
    //     // Log the values array to check its content
    //     console.log("Values Array:", values);
    
    //     if (currentValue) {
    //         console.log("UPDATE UPDATE");
    
    //         // Create a new color object based on the current color and the updated color
    //         const updatedColor = {
    //             ...currentValue.color,
    //             [colorType]: newColor
    //         };
    
    //         console.log("Updated Color:", updatedColor);
    //         console.log("Current Value Before Update:", currentValue);
    
    //         // Call updateValue with the new color
    //         updateValue(wheelId, valueId, currentValue.value, updatedColor);
    //     } else {
    //         console.error("No matching value found for ID:", valueId);
    //     }
    // };
    
    // const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, valueId: string, wheelId: string, colorType: keyof Color) => {
    //     const newColor = e.target.value;
    //     console.log("New Color:", newColor, "Value ID:", valueId, "Color Type:", colorType);
        
    //     const currentValue = values.find(v => v.id === valueId);
    //     console.log("Current Value:", currentValue);
    
    //     if (currentValue) {
    //         const updatedColor = {
    //             ...currentValue.color,
    //             [colorType]: newColor
    //         };
    
    //         console.log("Updated Color:", updatedColor);
    //         console.log("Current Value Before Update:", currentValue);
    
    //         updateValue(wheelId, valueId, currentValue.value, updatedColor);
    //     } else {
    //         console.error("No matching value found for ID:", valueId);
    //     }
    // };
    
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>, valueId: string, wheelId: string, colorType: keyof Color) => {
        const newColor = e.target.value;
        console.log("New Color:", newColor, "Value ID:", valueId, "Color Type:", colorType);
        
        const currentValue = values.find(v => v.id === valueId);
        console.log("Current Value:", currentValue);
        
        if (currentValue) {
            console.log("UPDATE UPDATE", currentValue.color);
    
            const updatedColor: Color = {
                ...currentValue.color,
                [colorType]: newColor || '#000000'
            };
    
            console.log("Updated Color:", updatedColor);
    
            // updateValue(wheelId, valueId, currentValue.value, updatedColor);
            updateValue('hardcodedWheelId', 'hardcodedValueId', 'testValue', { sliceColor: 'rambkl', textColor: 'gamble' });
        } else {
            console.error("No matching value found for ID:", valueId);
        }
    };
    

    // const toggleShowOptions = (valueId: string) => {
    //     setShowOptions(prev => (prev === valueId ? null : valueId));
    // };

    if (!wheel) {
        return <div>No wheel data available</div>;
    }

    // useEffect(() => {
    //     console.log('Updated values:', values);
    // }, [values]);
    

    return (
        <>
            <h2>Value Control</h2>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='dnd-list' direction="vertical">
                    {(provided) => (
                        <motion.ul className="grid max-w-lg gap-2 px-5 m-auto" {...provided.droppableProps} ref={provided.innerRef}>
                            {values.map((valObj, index) => (
                                <Draggable key={valObj.id} draggableId={`${valObj.id}`} index={index} >
                                    {(provided, snapshot) => (

                                        <motion.li
                                            style={{ backgroundColor: valObj.color.sliceColor || '#ff0000' }}
                                            className={cn(
                                                'p-5 rounded-xl bg-zinc-900',
                                                { 'bg-zinc-700': snapshot.isDragging }
                                            )}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            key={valObj.id}
                                        >
                                            {editingValueId === valObj.id ? (
                                                <motion.div layout key={valObj.id} className="flex gap-2">
                                                    <Input
                                                        ref={editInputRef}
                                                        type="text"
                                                        value={editedValue}
                                                        onChange={e => setEditedValue(e.target.value)}
                                                    />
                                                    <button
                                                        className="px-5 py-2 text-sm font-normal text-orange-300 bg-orange-900 border-2 border-orange-900 active:scale-95 rounded-xl"
                                                        onClick={() => handleUpdate(valObj.id, valObj.wheel_id,
                                                            // valObj.color.sliceColor || '#ff0000'
                                                            {
                                                                sliceColor: valObj.color.sliceColor || '#ff0000',
                                                                textColor: valObj.color.textColor || '#000000'
                                                            }
                                                        )}
                                                    >
                                                        Save
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <motion.span layout>
                                                        <span>{valObj.value}</span>
                                                    </motion.span>
                                                    <div className="flex justify-between gap-5 text-white">
                                                        <div className="flex items-center gap-2">
                                                            {showOptions === valObj.id ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => setShowOptions(null)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        Hide Options
                                                                    </button>
                                                                    <div className='options'>
                                                                        <button
                                                                            onClick={() => handleEditStart(valObj.id, valObj.value)}
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <FaRegEdit />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(valObj.wheel_id, valObj.id)}
                                                                            className="flex items-center gap-1 text-red-500"
                                                                        >
                                                                            <RiDeleteBin7Line />
                                                                            Delete
                                                                        </button>
                                                                        <label>
                                                                            Slice color:
                                                                            <Input
                                                                                type="color"
                                                                                onChange={(e) => handleColorChange(e, valObj.id, valObj.wheel_id, 'sliceColor')}
                                                                                value={valObj.color.sliceColor || '#ff0000'}
                                                                            />
                                                                            <span className='color mirror' aria-hidden="true" />
                                                                        </label>
                                                                        <label>
                                                                            Text color:
                                                                            <Input
                                                                                type="color"
                                                                                onChange={(e) => handleColorChange(e, valObj.id, valObj.wheel_id, 'textColor')}
                                                                                value={valObj.color.textColor || '#000000'}
                                                                            />
                                                                            <span className='color mirror' aria-hidden="true" />
                                                                        </label>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span
                                                                    onClick={() => setShowOptions(valObj.id)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    ⚙️
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </motion.li>

                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </motion.ul>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default ValuesControl;





