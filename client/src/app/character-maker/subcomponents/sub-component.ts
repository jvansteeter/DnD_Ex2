import { Aspect, AspectType } from '../aspect';

export class subComponent {
    aspect: Aspect;
    value: any;

    getAspectType(): AspectType {
        return this.aspect.aspectType;
    }
}