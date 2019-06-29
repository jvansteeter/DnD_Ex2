import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { EncounterService } from './encounter.service';
import { ActivatedRoute } from '@angular/router';
import { EncounterConcurrencyService } from './encounter-concurrency.service';
import { RightsService } from '../data-services/rights.service';
import { BoardTraverseService } from "../board/services/board-traverse.service";
import { BoardVisibilityService } from "../board/services/board-visibility.service";
import { BoardTransformService } from "../board/services/board-transform.service";
import { BoardCanvasService } from "../board/services/board-canvas.service";
import { BoardPlayerService } from "../board/services/board-player.service";
import { BoardWallService } from "../board/services/board-wall.service";
import { BoardLightService } from "../board/services/board-light.service";
import { BoardStateService } from "../board/services/board-state.service";
import { BoardTeamsService } from "../board/services/board-teams.service";
import { BoardNotationService } from "../board/services/board-notation-service";
import { BoardStealthService } from '../board/services/board-stealth.service';
import { EncounterKeyEventService } from "./encounter-key-event.service";

@Component({
	selector: 'encounter',
	templateUrl: 'encounter.component.html',
	styleUrls: ['encounter.component.scss']
})
export class EncounterComponent implements OnInit, OnDestroy {
	public finishedLoading: boolean = false;

	constructor(private encounterService: EncounterService,
	            private activatedRoute: ActivatedRoute,
	            private encounterConcurrencyService: EncounterConcurrencyService,
	            private rightsService: RightsService,
	            private boardStateService: BoardStateService,
	            private boardVisibilityService: BoardVisibilityService,
	            private boardTransformService: BoardTransformService,
	            private boardCanvasService: BoardCanvasService,
	            private boardPlayerService: BoardPlayerService,
	            private boardWallService: BoardWallService,
	            private boardLightService: BoardLightService,
	            private boardNotationService: BoardNotationService,
	            private boardTeamsService: BoardTeamsService,
	            private boardTraverseService: BoardTraverseService,
	            private stealthService: BoardStealthService,
	            private keyInputService: EncounterKeyEventService,
	) {
	}

	ngOnInit(): void {
		this.encounterConcurrencyService.init();
		this.activatedRoute.params.subscribe((params) => {
			let encounterId = params['encounterId'];
			this.encounterService.setEncounterId(encounterId);
			this.encounterService.isReadyObservable.subscribe((isReady: boolean) => {
				if (isReady) {
					this.rightsService.setEncounterService(this.encounterService);
				}
			});
		});

		this.boardCanvasService.isReadyObservable.subscribe((isReady: boolean) => {
			if (isReady) {
				this.finishedLoading = true;
			}
		});

		this.boardStateService.init();
		this.boardLightService.init();
		this.boardWallService.init();
		this.boardPlayerService.init();
		this.boardCanvasService.init();
		this.boardTransformService.init();
		this.boardVisibilityService.init();
		this.boardTraverseService.init();
		this.boardTeamsService.init();
		this.boardNotationService.init();
		this.stealthService.init();
	}

	ngOnDestroy(): void {
		this.encounterConcurrencyService.unInit();
		this.boardStateService.unInit();
		this.boardLightService.unInit();
		this.boardWallService.unInit();
		this.boardPlayerService.unInit();
		this.boardCanvasService.unInit();
		this.boardTransformService.unInit();
		this.boardTraverseService.unInit();
		this.boardVisibilityService.unInit();
		this.boardTeamsService.unInit();
		this.boardNotationService.unInit();
		this.stealthService.unInit();
	}

	@HostListener('document:keyup', ['$event'])
	public keyup(event): void {
		this.keyInputService.keyup(event);
	}
}