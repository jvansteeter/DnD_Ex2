import { Component } from '@angular/core';
import { BreadCrumbService } from '../bread-crumb.service';
import { Router } from '@angular/router';

@Component({
	selector: 'bread-crumbs',
	templateUrl: 'bread-crumb.component.html',
	styleUrls: ['bread-crumb.component.scss']
})
export class BreadCrumbComponent {
	constructor(public breadCrumbService: BreadCrumbService, private router: Router) {

	}

	public goToCrumb(crumb: {name: string, location: string}): void {
		this.router.navigate([crumb.location]);
	}
}