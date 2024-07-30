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

interface ValuesControlProps {
    wheel?: Wheel;
    onUpdateValue: (wheel_id: string, value_id: string, new_value: string) => void;
    
    deleteValue: (wheel_id: string, value_id: string) => void;
}

const ValuesControl: React.FC<ValuesControlProps> = ({ wheel, onUpdateValue, 
    
     deleteValue }) => {
    const [editingValueId, setEditingValueId] = useState<string | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [values, setValues] = useState<Value[]>([]);
    const editInputRef = useRef<HTMLInputElement>(null);

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
                const orderedValues = order.map((id: string) => wheel.values.find(v => v.id === id));
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
    }, [wheel?.values]);

    const handleEditStart = (valueId: string, originalValue: string) => {
        setEditingValueId(valueId);
        setEditedValue(originalValue);
        if (editInputRef.current) {
            editInputRef.current.focus();
        }
    };

    const handleUpdate = (valueId: string, wheelId: string) => {
        if (editedValue.trim() !== '') {
            onUpdateValue(wheelId, valueId, editedValue);
            // onValueChanged();
            setEditingValueId(null);
            setEditedValue('');
            toast.success('Value updated successfully!');
        } else {
            toast.error('Value field cannot be empty!');
        }
    };

    const handleDelete = (wheelId: string, valueId: string) => {
        deleteValue(wheelId, valueId);
        // onValueChanged();
        toast.success('Value deleted successfully!');
    };


    // const handleOnDragEnd = (result: any) => {
    //   console.log(wheel?.values)
    // };

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const reorderedValues = Array.from(values);
        const [movedItem] = reorderedValues.splice(source.index, 1);
        reorderedValues.splice(destination.index, 0, movedItem);

        setValues(reorderedValues);

        if (wheel) {
            const updatedWheels = JSON.parse(localStorage.getItem('wheels') || '[]') as Wheel[];
            const updatedWheelsWithNewOrder = updatedWheels.map(wheel => {
                if (wheel.id === wheel.id) {
                    return { ...wheel, values: reorderedValues };
                }
                return wheel;
            });
            localStorage.setItem('wheels', JSON.stringify(updatedWheelsWithNewOrder));
        }
    };

    if (!wheel) {
        return <div>No wheel data available</div>;
    }

    return (
        <>
            <h2>Value Control</h2>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='dnd-list' direction="vertical">
                    {(provided) => (
                        <motion.ul className="grid max-w-lg gap-2 px-5 m-auto" {...provided.droppableProps} ref={provided.innerRef}>
                            {values.map((valObj, index) => (
                                <Draggable key={valObj.id} draggableId={`${valObj.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <motion.li
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
                                                        onClick={() => handleUpdate(valObj.id, valObj.wheel_id)}
                                                    >
                                                        Save
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col gap-5">
                                                    <motion.span layout>
                                                        <span>{valObj.value}</span>
                                                    </motion.span>
                                                    <div className="flex justify-between gap-5 text-white">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEditStart(valObj.id, valObj.value)}
                                                                className="flex items-center gap-1 "
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
                                                        </div>
                                                    </div>
                                                </div>
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


