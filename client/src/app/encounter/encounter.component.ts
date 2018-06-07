import { Component, OnInit } from '@angular/core';
import { EncounterService } from './encounter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'encounter',
	templateUrl: 'encounter.component.html',
  styleUrls: ['encounter.component.css']
})
export class EncounterComponent implements OnInit {
	public ready: boolean = false;

	constructor(private encounterService: EncounterService,
							private activatedRoute: ActivatedRoute) {

	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			let encounterId = params['encounterId'];
			this.encounterService.setEncounterId(encounterId);
			this.encounterService.isReady().subscribe((isReady: boolean) => {
				this.ready = isReady;
			});
		});
	}
}