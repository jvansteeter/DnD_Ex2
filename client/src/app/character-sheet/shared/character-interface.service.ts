import { Aspect } from '../../types/character-sheet/aspect';
import { SubComponent } from './subcomponents/sub-component';


export interface CharacterInterfaceService {
	immutable: boolean;

	init(): void;

	registerSubComponent(subComponent: SubComponent): void;

	valueOfAspect(aspect: Aspect): any;

	getValueOfAspectByLabel(label: string): any;

	updateFunctionAspects(): void;

	getGridHeight(): number;
}