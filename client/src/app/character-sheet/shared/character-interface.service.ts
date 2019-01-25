import { Aspect } from './aspect';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { CharacterAspectComponent } from './character-aspect.component';
import { GridsterConfig } from "angular-gridster2";
import { IsReadyService } from '../../utilities/services/isReady.service';

export interface CharacterInterfaceService extends IsReadyService {
	aspects: Aspect[];

	readonly immutable: boolean;

	characterSheet: CharacterSheetData;

	gridOptions: GridsterConfig;

	init(): void;

	registerAspectComponent(aspectComponent: CharacterAspectComponent): void;

	removeComponent(aspect: Aspect): void;

	getAspectValue(aspectLabel: string): any;

	updateFunctionAspects(): void;
}