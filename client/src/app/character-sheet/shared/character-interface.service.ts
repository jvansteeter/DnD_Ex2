import { Aspect } from './aspect';
import { SubComponent } from './subcomponents/sub-component';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { Observable } from 'rxjs';
import { CharacterAspectComponent } from './character-aspect.component';

export interface CharacterInterfaceService {
	aspects: Aspect[];

	readonly immutable: boolean;

	characterSheet: CharacterSheetData;

	removeComponentObservable: Observable<void>;

	init(): void;

	registerAspectComponent(aspectComponent: CharacterAspectComponent): void;

	removeComponent(aspect: Aspect): void;

	getAspectValue(aspectLabel: string): any;

	updateFunctionAspects(): void;

	getGridHeight(): number;
}