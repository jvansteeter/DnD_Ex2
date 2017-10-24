import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from './character-interface.service';


@Injectable()
export class CharacterInterfaceFactory {
    private characterInterface: CharacterInterfaceService;

    constructor() {

    }

    setCharacterInterface(characterInterface: CharacterInterfaceService): void {
        this.characterInterface = characterInterface;
    }

    getCharacterInterface(): CharacterInterfaceService {
        return this.characterInterface;
    }
}
