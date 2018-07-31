import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CharacterMakerService } from '../maker/character-maker.service';
import { Aspect } from '../../types/character-sheet/aspect';
import { SubComponent } from './subcomponents/sub-component';
import { isUndefined } from 'util';

@Component({
	selector: 'character-aspect',
	templateUrl: 'character-aspect.component.html',
	styleUrls: ['character-sheet.scss', 'character-aspect.component.scss']
})
export class CharacterAspectComponent implements OnInit, AfterViewInit {
	@Input('aspect') aspect: Aspect;

	private moveDeltaX: number = 0;
	private moveDeltaY: number = 0;

	private moveTempX: number = 0;
	private moveTempY: number = 0;

	private resizeDeltaX: number = 0;
	private resizeDeltaY: number = 0;

	private resizeTempX: number = 0;
	private resizeTempY: number = 0;

	private boundingWidth: number = 0;

	public headerZIndex = 0;
	public hasOptions: boolean;

	@ViewChild('component')
	subComponent: SubComponent;

	constructor (
			private _elementRef: ElementRef,
			private renderer: Renderer2,
			public characterService: CharacterMakerService
	) {	}

	@HostListener('window:resize', ['$event.target'])
	private setBoundingWidth(): void {
		this.boundingWidth = document.getElementsByClassName('characterSheet-gridContainer')[0].getBoundingClientRect().width;
		this.aspect.config.width = this.boundingWidth * this.getPercentWidth() / 100;
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		this.setBoundingWidth();
		this.setConfigStyles();
		if (!isUndefined(this.subComponent)) {
			setTimeout(() => this.hasOptions = this.subComponent.hasOptions);
		}
	}

	public removeComponent(aspect: Aspect): void {
		this.characterService.removeComponent(aspect);
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
		this.resizeDeltaX = event.x - this.aspect.config.width;
		this.resizeDeltaY = event.y - Number(this._elementRef.nativeElement.style.height.replace('px', ''));
	}

	onResizeDrag(event): void {
		this.resizeTempX = event.x;
		this.resizeTempY = event.y;
		if (!this.resizeTempX || !this.resizeTempY) return;
		let height = this.resizeTempY - this.resizeDeltaY;
		let width = this.resizeTempX - this.resizeDeltaX;

		if (height >= this.aspect.config.minHeight) {
			this.aspect.config.height = height;
		}
		if (width >= this.aspect.config.minWidth && width < this.boundingWidth) {
			this.aspect.config.width = width;
		}
		this.setConfigStyles();
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
		this.renderer.setStyle(this._elementRef.nativeElement, 'width', this.getPercentWidth() + '%');
		if (this.aspect.config.resizeY) {
			this.renderer.setStyle(this._elementRef.nativeElement, 'height', this.aspect.config.height + 'px');
		}
	}

	private getPercentWidth(): number {
		return (this.aspect.config.width / this.boundingWidth) * 100;
	}
}
