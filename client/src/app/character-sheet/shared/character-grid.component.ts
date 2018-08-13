import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterInterfaceService } from './character-interface.service';
import { CharacterInterfaceFactory } from './character-interface.factory';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss', 'character-sheet.scss']
})
export class CharacterGridComponent implements OnInit, OnDestroy {
	private removeComponentSubscription: Subscription;
	private characterService: CharacterInterfaceService;

	constructor(private characterServiceFactory: CharacterInterfaceFactory,
							private elementRef: ElementRef,
							private renderer: Renderer2) {
	}

	public ngOnInit(): void {
		this.characterService = this.characterServiceFactory.getCharacterInterface();
		this.removeComponentSubscription = this.characterService.removeComponentObservable.subscribe(() => this.changeHeight());
	}

	public ngOnDestroy(): void {
		this.removeComponentSubscription.unsubscribe();
	}

	public changeHeight(): void {

		this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.characterService.getGridHeight() + 'px');
	}
}