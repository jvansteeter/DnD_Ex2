import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CharacterMakerService } from '../maker/character-maker.service';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss', 'character-sheet.scss']
})
export class CharacterGridComponent {
	constructor(public characterService: CharacterMakerService,
							private elementRef: ElementRef,
							private renderer: Renderer2) {
	}

	public changeHeight(): void {
		this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.characterService.getGridHeight() + 'px');
	}
}