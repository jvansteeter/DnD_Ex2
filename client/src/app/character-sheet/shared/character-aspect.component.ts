import { Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect } from '../../types/character-sheet/aspect';

@Component({
	selector: 'character-aspect',
	templateUrl: 'character-aspect.component.html',
	styleUrls: ['character-sheet.css', 'character-aspect.component.scss']
})
export class CharacterAspectComponent implements OnInit {
	@Input('aspect') aspect: Aspect;

	private moveDeltaX: number = 0;
	private moveDeltaY: number = 0;

	private moveTempX: number = 0;
	private moveTempY: number = 0;

	private resizeDeltaX: number = 0;
	private resizeDeltaY: number = 0;

	private resizeTempX: number = 0;
	private resizeTempY: number = 0;

	public headerZIndex = 0;
	public hasOptions: boolean;

	constructor (
			private _elementRef: ElementRef,
			private renderer: Renderer2,
			public characterService: CharacterMakerService
	) {}

	ngOnInit(): void {
		this.setConfigStyles();
	}

	onMoveDragStart(event): void {
		if (event.dataTransfer != null) {
			event.dataTransfer.setData('text/plain', null);
		}

		this.moveDeltaX = event.x - this._elementRef.nativeElement.offsetLeft;
		this.moveDeltaY = event.y - this._elementRef.nativeElement.offsetTop;
	}

	onMoveDrag(event): void {
		this.moveTempX = event.x;
		this.moveTempY = event.y;
		if (!this.moveTempX || !this.moveTempY) return;
		let top = this.moveTempY - this.moveDeltaY;
		let left = this.moveTempX - this.moveDeltaX;

		if (top > 0) {
			this.aspect.config.top = top;
			this.setConfigStyles();
		}
		if (left > 0) {
			this.aspect.config.left = left;
			this.setConfigStyles();
		}
	}

	onMoveDragEnd(): void {
		this.moveDeltaX = 0;
		this.moveDeltaY = 0;
	}

	onResizeDragStart(event): void {
		this.resizeDeltaX = event.x - Number(this._elementRef.nativeElement.style.width.replace('px', ''));
		this.resizeDeltaY = event.y - Number(this._elementRef.nativeElement.style.height.replace('px', ''));
	}

	onResizeDrag(event): void {
		this.resizeTempX = event.x;
		this.resizeTempY = event.y;
		if (!this.resizeTempX || !this.resizeTempY) return;
		let height = this.resizeTempY - this.resizeDeltaY;
		let width = this.resizeTempX - this.resizeDeltaX;

		// if (height > 0) {
		// 	this.aspect.config.height = height;
			// this.setConfigStyles();
		// }
		// if (width > 0) {
			this.aspect.config.width = width;
			this.setConfigStyles();
		// }
		// this.aspect.config.width += event.x;
		// this.aspect.config.height += event.y;
		// this.setConfigStyles();
	}

	onResizeDragEnd(): void {
		this.resizeDeltaX = 0;
		this.resizeDeltaY = 0;
	}

	@HostListener('mouseenter')
	hoverStart(): void {
		this.headerZIndex = 2;
	}

	@HostListener('mouseleave')
	hoverEnd(): void {
		this.headerZIndex = 0;
	}

	private setConfigStyles(): void {
		this.renderer.setStyle(this._elementRef.nativeElement, 'top', this.aspect.config.top + 'px');
		this.renderer.setStyle(this._elementRef.nativeElement, 'left', this.aspect.config.left + 'px');
		this.renderer.setStyle(this._elementRef.nativeElement, 'width', this.aspect.config.width + 'px');
		// this.renderer.setStyle(this._elementRef.nativeElement, 'height', this.aspect.config.height + 'px');
	}
}
