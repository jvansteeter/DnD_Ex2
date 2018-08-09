import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'character-grid',
	templateUrl: 'character-grid.component.html',
	styleUrls: ['character-grid.component.scss', 'character-sheet.scss']
})
export class CharacterGridComponent implements OnInit, OnDestroy {
	private removeComponentSubscription: Subscription;

	constructor(public characterService: CharacterMakerService,
							private elementRef: ElementRef,
							private renderer: Renderer2) {
	}

	public ngOnInit(): void {
		this.removeComponentSubscription = this.characterService.removeComponentObservable.subscribe(() => this.changeHeight());
	}

	public ngOnDestroy(): void {
		this.removeComponentSubscription.unsubscribe();
	}

	public changeHeight(): void {
		this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.characterService.getGridHeight() + 'px');
	}
}