import { Aspect } from './aspect';
import { SubComponent } from './subcomponents/sub-component';


export interface CharacterInterfaceService {
    immutable: boolean;
    init(): void;
    registerSubComponent(subComponent: SubComponent): void;
    valueOfAspect(aspect: Aspect): any;
    updateFunctionAspects(): void;
}