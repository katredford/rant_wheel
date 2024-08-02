export interface Image {
    id: string;
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    src: string;
}

export interface Value {
    id: string;
    value: string;
    wheel_id: string;
    color: string;
    imgSrc: Image;

}



export interface Wheel {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    values: Value[];
    isRandom: boolean;
    cycleOnce: boolean;
}
