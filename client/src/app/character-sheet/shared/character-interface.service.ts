import { Aspect } from './aspect';


export interface CharacterInterfaceService {
    init(): void;
    valueOfAspect(aspect: Aspect): any;
    updateFunctionAspects(): void;
}