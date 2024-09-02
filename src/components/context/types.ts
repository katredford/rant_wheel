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
    color: Color,
    imgSrc: Image;

}

export interface Color {
    textColor: string;
    sliceColor: string;
}

export interface Pointer {
    pointerImg: Image,
    
}

export interface Wheel {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    values: Value[];
    isRandom: boolean;
    cycleOnce: boolean;
    strokeColor:string;
    strokeWidth: number;
    spinLength: number;
    slowDown: number;
    radius: number;
}
