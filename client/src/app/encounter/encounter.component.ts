import { Component, OnInit } from '@angular/core';
import { EncounterService } from './encounter.service';
import { ActivatedRoute } from '@angular/router';
import { EncounterConcurrencyService } from './encounter-concurrency.service';
import { RightsService } from '../data-services/rights.service';

@Component({
	selector: 'encounter',
	templateUrl: 'encounter.component.html',
  styleUrls: ['encounter.component.scss']
})
export class EncounterComponent implements OnInit {
	constructor(private encounterService: EncounterService,
							private activatedRoute: ActivatedRoute,
	            private encounterConcurrencyService: EncounterConcurrencyService,
	            private rightsService: RightsService) {
		this.encounterConcurrencyService.init();
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let encounterId = params['encounterId'];
			this.encounterService.setEncounterId(encounterId);
			this.encounterService.isReady().subscribe((isReady: boolean) => {
				if (isReady) {
					this.rightsService.setEncounterService(this.encounterService);
				}
			});
		});
	}
}