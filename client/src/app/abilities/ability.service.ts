import { Injectable } from "@angular/core";
import { CharacterSheetService } from "../character-sheet/sheet/character-sheet.service";

@Injectable()
export class AbilityService {
	constructor(private characterService: CharacterSheetService) {

	}

	public evaluationValueOfRollEquation(equation: string): any {
		let executable = equation;
		try {
			executable = 'let _this = ' + executable;
			executable = executable.concat(';return _this;');

			// replace aspects with their values
			if (executable.indexOf('${') > -1) {
				executable = executable.replace(/\${([\w\s]+)}/g, (match, offset: string): string => {
					return JSON.stringify(this.characterService.getAspectValue(offset));
				});
			}

			// replace 'd' notation with functions
			executable = executable.replace(/(\d+)d(\d+)/g, (match, ...offset): string => {
				const numberOfDice = offset[0];
				const numberOfSides = offset[1];
				let result: number = 0;
				for (let i = 0; i < numberOfDice; i++) {
					result += Math.floor(Math.random() * numberOfSides) + 1;
				}
				return String(result);
			});

			const result = new Function(executable)();
			return result;
		} catch (error) {
			console.log(executable);
			console.error(error);
			return 'NaN';
		}
	}
}