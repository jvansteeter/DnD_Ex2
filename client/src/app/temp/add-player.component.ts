import { Component } from '@angular/core';

@Component({
	templateUrl: 'add-player.component.html'
})
export class AddPlayerComponent {
	constructor() {

	}

	submit(): void {
		console.log('add submission logic Josh!')
	}
}