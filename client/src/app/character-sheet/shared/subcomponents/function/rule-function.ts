import { AspectServiceInterface } from '../../../../data-services/aspect.service.interface';

export class RuleFunction {
	constructor(public functionText: string, private aspectService: AspectServiceInterface, private playerId?: string) {
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
				executable = executable.replace(/\${([\w\s]+)}/g, (match, offset: string) => {
					let value: any = this.aspectService.getAspectValue(offset, this.playerId);
					return value;
				});
			}

			// console.log(executable);
			let result = new Function(executable)();
			return result;
		}
		catch (error) {
			console.log(executable);
			console.error(error);
			return 'NaN';
		}
	}
}