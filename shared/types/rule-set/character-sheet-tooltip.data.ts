import { Aspect } from '../../../client/src/app/character-sheet/shared/aspect';

export interface CharacterSheetTooltipData {
	aspects: [
			{
				icon: string;
				aspect: Aspect;
			}
		]
}