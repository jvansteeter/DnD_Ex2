export class DieEquation {
	private numberOfSides: number;

	constructor(equationString: string) {
		this.processEquation(equationString);
	}

	public roll(): number {
		return Math.floor(Math.random() * this.numberOfSides) + 1;
	}

	private processEquation(equasion: string): void {
		equasion = equasion.replace(/\s|{|}/g, '');
		equasion = equasion.replace(/(\d+)/g, '{$1}');
		const tokenArray: EquasionToken[] = [];
		for (let i = 0; i < equasion.length; i++) {
			let char = equasion.charAt(i);
			if (this.isNumberic(char)) {
				let nextChar = equasion.charAt(i + 1);
				tokenArray.push({
					type: EquasionTokenType.NUMBERIC,
					value: parseInt(char)
				})
			}
		}
	}

	private isNumberic(char): boolean {
		return !isNaN(char);
	}
}

class EquasionToken {
	type: EquasionTokenType;
	value: any;
}

enum EquasionTokenType {
	NUMBERIC,
	OPERATOR,
	D
}