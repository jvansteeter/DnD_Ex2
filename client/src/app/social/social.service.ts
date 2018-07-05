import { Injectable } from '@angular/core';
import { SocialRepository } from './social.repository';
import { Observable } from 'rxjs';
import { IsReadyService } from '../utilities/services/isReady.service';

@Injectable()
export class SocialService extends IsReadyService {
	constructor(private socialRepo: SocialRepository) {
		super();
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady) {
				this.setReady(true);
			}
			else {
				this.setReady(false);
			}
		});
	}

	public findUsers(criteria: string): Observable<any> {
		return this.socialRepo.findUsers(criteria);
	}
}