import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenData } from '../../../../../../../shared/types/token.data';

@Component({
	selector: 'characterMaker-tokenComponent',
	templateUrl: 'token.component.html',
	styleUrls: ['token.component.scss']
})
export class TokenComponent implements OnInit {
	public tokens: TokenData[] = [];

	@ViewChild('fileInput', {static: true}) fileInput: ElementRef;
	reader: FileReader = new FileReader();

	constructor() {

	}

	public ngOnInit(): void {
		if (this.tokens.length === 0) {
			this.tokens.push({
				url: '',
				widthInCells: 1,
				heightInCells: 1
			});
		}
	}

	getTokens() {
		return this.tokens;
	}

	setTokens(tokens: TokenData[]): void {
		this.tokens = tokens;
	}

	upload(): void {
		this.fileInput.nativeElement.click();
	}

	loadImage(): void {
		this.reader.addEventListener('load', () => {
			this.tokens[0].url = String(this.reader.result);
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}
}
