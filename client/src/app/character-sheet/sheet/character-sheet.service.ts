import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect } from '../shared/aspect';


@Injectable()
export class CharacterSheetService implements CharacterInterfaceService {
    updateFunctionAspects(): void {
        throw new Error('Method not implemented.');
    }

    valueOfAspect(aspect: Aspect): any {
        console.error('the character sheet service valueOfAspect function was called')
        return 'undefined';
    }
}