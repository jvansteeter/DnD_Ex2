import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from './character-interface.service';


@Injectable()
export class CharacterInterfaceFactory {
    private characterInterface: CharacterInterfaceService;

    constructor() {

    }

    setCharacterInterface(characterInterface: CharacterInterfaceService): void {
        console.log('set interface to')
        console.log(characterInterface)
        this.characterInterface = characterInterface;
    }

    getCharacterInterface(): CharacterInterfaceService {
        console.log('get interface')
        return this.characterInterface;
    }
}
