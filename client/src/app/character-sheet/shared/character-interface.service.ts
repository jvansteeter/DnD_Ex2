import { Aspect } from './aspect';
import { CharacterSheetData } from '../../../../../shared/types/rule-set/character-sheet.data';
import { CharacterAspectComponent } from './character-aspect.component';
import { GridsterConfig } from "angular-gridster2";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { Observable } from 'rxjs';
import { AspectServiceInterface } from '../../data-services/aspect.service.interface';

export interface CharacterInterfaceService extends AspectServiceInterface, IsReadyService {
	aspects: Aspect[];

	readonly immutable: boolean;

	characterSheet: CharacterSheetData;

	gridOptions: GridsterConfig;

	modifiersChangeObservable: Observable<void>;

	init(): void;

	registerAspectComponent(aspectComponent: CharacterAspectComponent): void;

	removeComponent(aspect: Aspect): void;

	updateFunctionAspects(): void;

	getRuleModifiers(aspect: Aspect): any;
}