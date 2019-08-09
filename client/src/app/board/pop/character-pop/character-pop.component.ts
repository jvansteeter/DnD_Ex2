import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { PopService } from '../pop.service';
import { Player } from '../../../encounter/player';
import { CharacterTooltipComponent } from '../../../character-sheet/character-tooltip/character-tooltip.component';
import { BoardStateService } from '../../services/board-state.service';
import { EncounterRepository } from '../../../repositories/encounter.repository';
import { RightsService } from '../../../data-services/rights.service';
import { isUndefined } from 'util';
import { MatDialog } from '@angular/material';
import { SubmitDamageDialogComponent } from '../damage-dialog/submit-damage-dialog.component';
import { DamageData } from '../../../../../../shared/types/rule-set/damage.data';
import { isDefined } from '@angular/compiler/src/util';
import { AcceptDamageDialogComponent } from '../damage-dialog/accept-damage-dialog.component';
import { EncounterKeyEventService } from '../../../encounter/encounter-key-event.service';

@Component({
	templateUrl: 'character-pop.component.html',
	styleUrls: ['character-pop.component.scss']
})
export class CharacterPopComponent {
	parentRef: PopService;
	pos_x: number;
	pos_y: number;
	player: Player;
	window = false;

	@ViewChild(CharacterTooltipComponent, {static: true})
	tooltipComponent: CharacterTooltipComponent;
	hovered = false;

	constructor(private boardStateService: BoardStateService,
	            private encounterRepo: EncounterRepository,
	            private rightsService: RightsService,
	            private keyEventService: EncounterKeyEventService,
	            private dialog: MatDialog,
	) {
	}

	public initVars(parentRef: PopService, window: boolean, pos_x: number, pos_y: number, player: Player) {
		this.parentRef = parentRef;

		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.player = player;
		this.tooltipComponent.playerId = player.id;
		this.tooltipComponent.tooltipConfig = player.tooltipConfig;

		this.window = window;
	}

	@HostListener('mouseenter')
	hoverStart(): void {
		this.hovered = true;
	}

	@HostListener('mouseleave')
	hoverEnd(): void {
		this.hovered = false;
	}

	close() {
		this.player.removeAuras();
		this.parentRef.clearPlayerPop(this.player._id);
	}

	public deletePlayer(): void {
		this.close();
		this.encounterRepo.removePlayer(this.player.serialize()).subscribe();
	}

	public openSubmitDamageDialog(): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(SubmitDamageDialogComponent).afterClosed().subscribe((damages: DamageData[]) => {
			if (isDefined(damages) && damages.length > 0) {
				this.player.damageRequests.push(...damages);
				this.player.emitChange();
			}
			this.keyEventService.startListeningToKeyEvents();
		});
	}

	public openAcceptDamageDialog(): void {
		this.keyEventService.stopListeningToKeyEvents();
		this.dialog.open(AcceptDamageDialogComponent, {data: this.player}).afterClosed().subscribe(() => this.keyEventService.startListeningToKeyEvents());
	}

	public toggleVisibility(): void {
		this.player.isVisible = !this.player.isVisible;
	}

	public hasRights(): boolean {
		if (isUndefined(this.tooltipComponent)) {
			return false;
		}

		return this.rightsService.hasRightsToPlayer(this.tooltipComponent.playerId);
	}
}
