import { Aspect } from '../aspect';

export interface SubComponentChild {
    aspect: Aspect;
    width: number;
    height: number;
    value: any;

    resize(width: number, height: number);
}