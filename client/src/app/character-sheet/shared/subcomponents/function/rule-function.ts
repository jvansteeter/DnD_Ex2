import { CharacterInterfaceService } from '../../character-interface.service';

export class RuleFunction {
	public functionText: string;

	constructor(functionText: string, private characterService: CharacterInterfaceService) {
		this.functionText = functionText;
	}

	public execute(): any {
		let executable = this.functionText;
		try {
			if (executable.indexOf('this') > -1) {
				executable = executable.replace(new RegExp('this', 'g'), '_this');
				executable = 'let _this; ' + executable;
				executable = executable.concat(';return _this;');
			}

			// replace aspects with their values
			if (executable.indexOf('${') > -1) {
				executable = executable.replace(/\${([\w\s]+(\[\d+])?)}/g, (match: string, offset: string): string => {
					console.log(offset)
					if (offset.match(/[\w\s]+\[\d+]/)) {

					}
					let value = this.characterService.getValueOfAspectByLabel(offset);
					if (Array.isArray(value)) {

					}
					// if (value !== undefined) {
					// 	return '\'' + value + '\'';
					// }

					return value;
				});
			}

			console.log(executable)
			let ruleFunction = new Function(executable);
			return ruleFunction();
		}
		catch (error) {
			console.error(error);
			return 'NaN';
		}
	}
}