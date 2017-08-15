import { Aspect, AspectType } from '../aspect';
import {ElementRef, Renderer2} from "@angular/core";

export class subComponent {
    aspect: Aspect;
    height: number;
    width: number;
    value: any;

    constructor() {
        this.height = 500;
        this.width = 500;
    }

    getAspectType(): AspectType {
        return this.aspect.aspectType;
    }

    dragEvent(event): void {
        console.log(event);
        console.log(this.width);
        console.log(this.height);
    }
}