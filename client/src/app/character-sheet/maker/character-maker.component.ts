import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { Aspect, AspectType } from '../../types/character-sheet/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { CharacterTooltipComponent } from '../character-tooltip/character-tooltip.component';
import { DashboardCard } from '../../cdk/dashboard-card/dashboard-card';
import { AddTooltipAspectComponent } from "./dialog/add-tooltip-aspect.component";

@Component({
	selector: 'character-maker',
	templateUrl: 'character-maker.component.html',
	styleUrls: ['character-maker.component.scss']
})
export class CharacterMakerComponent implements OnInit, AfterViewInit {
	private characterSheetId: string;

	@ViewChild('characterTooltip')
	private characterToolTipComponent: CharacterTooltipComponent;

	public characterToolTipCard: DashboardCard;

	public readonly preDefinedAspects = [
		{
			label: 'Map Token',
			checked: false
		},
		{
			label: 'Name',
			checked: false
		},
		{
			label: 'Health',
			checked: false
		}
	];

	constructor(private dialog: MatDialog,
	            private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            public characterService: CharacterMakerService) {
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
		this.characterToolTipCard = {
			title: 'Character Tooltip Preview',
		}
	}

	ngOnInit(): void {
		this.characterService.registerSubComponentObservable.subscribe((subComponent: SubComponent) => {
			if (subComponent.aspect.isPredefined) {
				for (let preDefinedAspect of this.preDefinedAspects) {
					if (preDefinedAspect.label.toLowerCase() === subComponent.aspect.label.toLowerCase()) {
						preDefinedAspect.checked = true;
						this.changePredefinedAspect(preDefinedAspect.label, true, true);
					}
				}
			}
			else {
				this.characterToolTipCard.menuOptions = [
					{
						title: 'Add Aspect to tooltip',
						function: this.addTooltipAspect
					}
				]
			}
		});
		this.characterService.removeComponentObservable.subscribe(() => {
			let tooltipAspects = this.characterService.getTooltipAspects();
			let notPredefined = false;
			for (let aspect of tooltipAspects) {
				if (!aspect.isPredefined) {
					notPredefined = true;
					break;
				}
			}
			if (!notPredefined) {
				this.characterToolTipCard.menuOptions = undefined;
			}
		});
	}

	ngAfterViewInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.characterSheetId = params['characterSheetId'];
			this.characterSheetRepository.getCharacterSheet(this.characterSheetId).subscribe((data: any) => {
				this.characterService.setCharacterSheet(data);
				this.characterService.initAspects(data.aspects);
				this.characterToolTipComponent.tooltipConfig = this.characterService.characterTooltipConfig;
			});
		});
	}

	public openAddDialog(): void {
		this.dialog.open(AddComponentComponent);
	}

	public save(): void {
		this.characterService.save();
	}

	public changePredefinedAspect(aspectLabel: string, checked: boolean, doNotAddComponent?: boolean): void {
		let aspectType: AspectType;
		let icon: string;
		switch (aspectLabel) {
			case ('Map Token'): {
				aspectType = AspectType.TOKEN;
				break;
			}
			case ('Name'): {
				aspectType = AspectType.TEXT;
				icon = 'account_circle';
				break;
			}
			case ('Health'): {
				aspectType = AspectType.NUMBER;
				icon = 'favorite';
				break;
			}
			default: {
				console.error('Predefined Aspect not defined');
				return;
			}
		}
		let aspect = new Aspect(aspectLabel, aspectType, true, true);
		if (checked) {
			if (!doNotAddComponent) {
				this.characterService.addComponent(aspect);
			}
			if (aspectType !== AspectType.TOKEN) {
				this.characterToolTipComponent.addAspect(aspect.label, icon);
			}
		}
		else {
			this.characterService.removeComponent(aspect);
			this.characterToolTipComponent.removeAspect(aspect.label);
		}
	}

	private addTooltipAspect = () => {
		let tooltipAspects = this.characterService.getTooltipAspects();
		for (let tooltipAspect of this.characterToolTipComponent.tooltipConfig.aspects) {
			for (let i = 0; i < tooltipAspects.length; i++) {
				if (tooltipAspects[i].label.toLowerCase() === tooltipAspect.label.toLowerCase()) {
					tooltipAspects.splice(i, 1);
					break;
				}
			}
		}
		this.dialog.open(AddTooltipAspectComponent, {
			data: {
				aspects: tooltipAspects
			}
		}).afterClosed().subscribe((tooltipAspect) => {
			if (tooltipAspect) {
				this.characterToolTipComponent.addAspect(tooltipAspect.label, tooltipAspect.icon);
			}
		});
	};
}
