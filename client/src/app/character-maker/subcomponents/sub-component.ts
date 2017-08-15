import { Aspect, AspectType } from '../aspect';

export class subComponent {
    aspect: Aspect;
    width: number;
    height: number;
    minHeight: number;
    minWidth: number;
    value: any;

    constructor(width: number, height: number) {
        this.width = width;
        this.minWidth = width;
        this.height = height;
        this.minHeight = height;
    }

    getAspectType(): AspectType {
        return this.aspect.aspectType;
    }

    dragEvent(event): void {
        if (this.width + event.offsetX > this.minWidth) {
            this.width += event.offsetX;
        }
        if (this.height + event.offsetY > this.minHeight) {
            this.height += event.offsetY;
        }
    }
}