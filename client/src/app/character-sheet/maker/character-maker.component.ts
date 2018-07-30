import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { Aspect } from '../../types/character-sheet/aspect';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';

@Component({
	selector: 'character-maker',
	templateUrl: 'character-maker.component.html',
	styleUrls: ['../shared/character-sheet.scss']
})
export class CharacterMakerComponent implements OnInit, AfterViewInit {
	@ViewChild('characterSheet') characterSheet: ElementRef;

	private characterSheetId: string;
	private characterSheetData: any;
	public hoveredZIndex: number[] = [];

	constructor(private dialog: MatDialog,
	            private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            public characterService: CharacterMakerService) {
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
	}

	ngOnInit(): void {
		this.characterService.init();
	}

	ngAfterViewInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.characterSheetId = params['characterSheetId'];
			this.characterSheetRepository.getCharacterSheet(this.characterSheetId).subscribe((data: any) => {
				this.characterSheetData = data;
				this.characterService.setCharacterSheetId(this.characterSheetId);
				this.characterService.initAspects(data.aspects);
			});
		});
	}

	public openAddDialog(): void {
		this.dialog.open(AddComponentComponent);
	}

	public removeComponent(aspect: Aspect): void {
		this.characterService.removeComponent(aspect);
	}

	public save(): void {
		this.characterService.save();
	}

	openOptions(): void {
	}

	hoverStart(index: number): void {
		this.hoveredZIndex[index] = 2;
	}

	hoverEnd(index: number): void {
		this.hoveredZIndex[index] = 0;
	}
}
