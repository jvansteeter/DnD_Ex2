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
				executable = executable.replace(/\${([\w\s]+)}/g, (match, offset: string): string => {
					return JSON.stringify(this.characterService.valueOfAspect(offset));
				});
			}

			console.log(executable)
			let result = new Function(executable)();
			return result;
		}
		catch (error) {
			console.error(error);
			return 'NaN';
		}
	}
}