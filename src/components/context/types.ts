export interface Value {
    id: number;
    value: string;
    wheel_id: string;
}

export interface Wheel {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    values: Value[];
    isRandome: boolean;
    cycleOnce: boolean;
}
