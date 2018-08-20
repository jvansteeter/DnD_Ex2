import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
	selector: 'characterMaker-tokenComponent',
	templateUrl: 'token.component.html',
	styleUrls: ['token.component.scss']
})
export class TokenComponent {
	private tokenUrl: string = '';

	@ViewChild('fileInput') fileInput: ElementRef;
	reader: FileReader = new FileReader();

	constructor() {

	}

	getTokenUrl() {
		return this.tokenUrl;
	}

	setTokenUrl(tokenUrl: string): void {
		this.tokenUrl = tokenUrl;
	}

	upload(): void {
		this.fileInput.nativeElement.click();
	}

	loadImage(): void {
		this.reader.addEventListener('load', () => {
			this.tokenUrl = this.reader.result;
		});
		if (this.fileInput.nativeElement.files[0]) {
			this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
		}
	}
}
