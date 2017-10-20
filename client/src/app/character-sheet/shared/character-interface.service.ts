import { Aspect } from './aspect';


export interface CharacterInterfaceService {
    valueOfAspect(aspect: Aspect): any;
    updateFunctionAspects(): void;
}