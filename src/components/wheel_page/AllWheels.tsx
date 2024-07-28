// AllWheels.tsx
import React, { useContext } from 'react';
import WheelCard from './WheelCard';
import { WheelContext } from '../context/WheelContext';
import WheelForm from "./WheelForm"

const AllWheels: React.FC = () => {
    const { wheels, loading } = useContext(WheelContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    const sortedWheels = [...wheels].sort((a, b) => a.id - b.id);
    console.log(wheels)
    return (
        <div>
            <WheelForm />
            <h1>Wheel Titles</h1>
            <ul>
                {sortedWheels.map(wheel => (
                    <WheelCard key={wheel.id} {...wheel} />
                ))}
            </ul>
        </div>
    );
};

export default AllWheels;
