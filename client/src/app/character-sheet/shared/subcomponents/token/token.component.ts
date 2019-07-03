import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenData } from '../../../../../../../shared/types/token.data';

@Component({
	selector: 'characterMaker-tokenComponent',
	templateUrl: 'token.component.html',
	styleUrls: ['token.component.scss']
})
export class TokenComponent {
	public tokens: TokenData[] = [];

	@ViewChild('fileInput', {static: true}) fileInput: ElementRef;
	reader: FileReader = new FileReader();

	public selectedIndex: number = 0;

	constructor() {

	}

	getTokens() {
		const tokens = [];
		for (let token of this.tokens) {
			if (token.url !== '') {
				tokens.push(token);
			}
		}
		return tokens;
	}

	setTokens(tokens: TokenData[]): void {
		this.tokens = tokens;
		if (this.tokens.length === 0) {
			this.tokens.push({
				url: '',
				widthInCells: 1,
				heightInCells: 1
			});
		}
	}

	upload(): void {
		this.fileInput.nativeElement.click();
	}

	loadImage(): void {
		this.reader.addEventListener('load', () => {
			this.tokens[this.selectedIndex].url = String(this.reader.result);
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}

	public addToken(): void {
		this.tokens.push({
			url: '',
			widthInCells: 1,
			heightInCells: 1
		});
		this.selectedIndex = this.tokens.length - 1;
	}

	public removeToken(): void {
		if (this.selectedIndex !== 0) {
			this.tokens.splice(this.selectedIndex, 1);
			this.selectedIndex--;
		}
	}
}
