import { Aspect } from './aspect';
import { SubComponent } from './subcomponents/sub-component';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { Observable } from 'rxjs';

export interface CharacterInterfaceService {
	aspects: Aspect[];

	readonly immutable: boolean;

	characterSheet: CharacterSheetData;

	removeComponentObservable: Observable<void>;

	init(): void;

	registerSubComponent(subComponent: SubComponent): void;

	removeComponent(aspect: Aspect): void;

	valueOfAspect(aspectLabel: string): any;

	updateFunctionAspects(): void;

	getGridHeight(): number;
}