import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CharacterInterfaceFactory } from '../shared/character-interface.factory';
import { CharacterSheetRepository } from '../../repositories/character-sheet.repository';
import { Aspect, AspectType } from '../shared/aspect';
import { CharacterTooltipComponent } from '../character-tooltip/character-tooltip.component';
import { DashboardCard } from '../../cdk/dashboard-card/dashboard-card';
import { AddTooltipAspectComponent } from "./dialog/add-tooltip-aspect.component";
import { AspectData } from '../../../../../shared/types/rule-set/aspect.data';
import { PredefinedAspects, RequiredAspects } from '../../../../../shared/required-aspects.enum';
import { CharacterAspectComponent } from '../shared/character-aspect.component';

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

	private readonly requiredAspects = [
		{
			label: RequiredAspects.VISION,
			type: AspectType.NUMBER
		},
		{
			label: RequiredAspects.DARK_VISION,
			type: AspectType.BOOLEAN
		},
		{
			label: RequiredAspects.SPEED,
			type: AspectType.NUMBER
		}
	];

	public readonly preDefinedAspects = [
		{
			label: PredefinedAspects.NAME,
			checked: false
		},
		{
			label: PredefinedAspects.HEALTH,
			checked: false
		},
	];

	constructor(private dialog: MatDialog,
	            private activatedRoute: ActivatedRoute,
	            private characterSheetRepository: CharacterSheetRepository,
	            private characterInterfaceFactory: CharacterInterfaceFactory,
	            public characterService: CharacterMakerService) {
		this.characterService.init();
		this.characterInterfaceFactory.setCharacterInterface(this.characterService);
		this.characterToolTipCard = {
			title: 'Character Tooltip Preview',
			menuOptions: [
				{
					title: 'Add Aspect to tooltip',
					function: this.addTooltipAspect
				}
			]
		}
	}

	ngOnInit(): void {
		this.characterService.registerAspectComponentObservable.subscribe((aspectComponent: CharacterAspectComponent) => {
			if (aspectComponent.aspect.isPredefined) {
				for (let preDefinedAspect of this.preDefinedAspects) {
					if (preDefinedAspect.label.toLowerCase() === aspectComponent.aspect.label.toLowerCase()) {
						preDefinedAspect.checked = true;
					}
				}
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
		});
	}

	ngAfterViewInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.characterSheetId = params['characterSheetId'];
			this.characterSheetRepository.getCharacterSheet(this.characterSheetId).subscribe((data: any) => {
				this.characterService.setCharacterSheet(data);
				let aspects = this.addRequiredAspects(data.aspects);
				this.characterService.initAspects(aspects);
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

	public changePredefinedAspect(aspectLabel: string, checked: boolean): void {
		let aspectType: AspectType;
		let icon: string;
		switch (aspectLabel) {
			case ('Name'): {
				aspectType = AspectType.TEXT;
				icon = 'account_circle';
				break;
			}
			case ('Health'): {
				aspectType = AspectType.CURRENT_MAX;
				icon = 'favorite';
				break;
			}
			case ('Speed'): {
				aspectType = AspectType.NUMBER;
				icon = 'arrow_right_alt';
				break;
			}
			default: {
				console.error('Predefined Aspect not defined');
				return;
			}
		}
		if (checked) {
			let aspect = new Aspect(aspectLabel, aspectType, true, true);
			this.characterService.addComponent(aspect);
			this.characterToolTipComponent.addAspect(aspect, icon);
		}
		else {
			let aspect = this.characterService.getAspectByLabel(aspectLabel);
			this.characterService.removeComponent(aspect);
			this.characterToolTipComponent.removeAspect(aspect.label);
		}
	}

	public startNewRule(): void {

	}

	private addTooltipAspect = () => {
		let tooltipAspects = this.characterService.getTooltipAspects();
		for (let tooltipAspect of this.characterToolTipComponent.tooltipConfig.aspects) {
			for (let i = 0; i < tooltipAspects.length; i++) {
				if (tooltipAspects[i].label.toLowerCase() === tooltipAspect.aspect.label.toLowerCase()) {
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
				this.characterToolTipComponent.addAspect(this.characterService.getAspect(tooltipAspect.label), tooltipAspect.icon);
			}
		});
	};

	private addRequiredAspects(aspects: AspectData[]): AspectData[] {
		for (let requiredAspect of this.requiredAspects) {
			let found = false;
			for (let existingAspect of aspects) {
				if (existingAspect.label.toLowerCase() === requiredAspect.label.toLowerCase()) {
					found = true;
					break;
				}
			}
			if (!found) {
				aspects.push(new Aspect(requiredAspect.label, requiredAspect.type, true, true));
			}
		}

		return aspects;
	}
}
