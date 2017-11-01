import { Injectable } from '@angular/core';
import { CharacterInterfaceService } from '../shared/character-interface.service';
import { Aspect, AspectType } from '../shared/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';


@Injectable()
export class CharacterSheetService implements CharacterInterfaceService {
    public aspects: Aspect[];
    private subComponents: SubComponent[];

    public immutable = true;

    constructor() {
        this.init();
    }

    init(): void {
        this.subComponents = [];
    }

    registerSubComponent(subComponent: SubComponent): void {
        this.subComponents.push(subComponent);
    }

    valueOfAspect(aspect: Aspect): any {
        for (let i = 0; i < this.subComponents.length; i++) {
            let subComponent = this.subComponents[i];
            if (subComponent.aspect.label === aspect.label) {
                return subComponent.getValue();
            }
        }

        return null;
    }

    updateFunctionAspects(): void {
        this.subComponents.forEach(subComponent => {
            if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
                subComponent.getValue();
            }
        })
    }

    setAspects(aspects: Aspect[]): void {
        this.aspects = aspects;
    }
}