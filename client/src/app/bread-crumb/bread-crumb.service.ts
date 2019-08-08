import { Injectable } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class BreadCrumbService {
	public crumbs: { name: string, location: string }[] = [];

	constructor(private router: Router) {
		this.router.events.pipe(
				filter((event: Event) => event instanceof NavigationStart),
				map((event: Event) => event as NavigationStart),
		).subscribe((event: NavigationStart) => {
			for (let i = 0; i < this.crumbs.length; i++) {
				const crumb = this.crumbs[i];
				if (event.url.includes(crumb.location)) {
					this.crumbs.splice(i);
					break;
				}
			}
		});
	}

	public addCrumb(name: string, location: string): void {
		this.crumbs.push({name, location});
	}

	public clearCrumbs(): void {
		this.crumbs.splice(0);
	}
}