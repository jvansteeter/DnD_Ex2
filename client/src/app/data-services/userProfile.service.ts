import { UserProfile } from '../types/userProfile';
import { Injectable } from '@angular/core';
import { UserRepository } from '../repositories/user.repository';
import { IsReadyService } from '../utilities/services/isReady.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserProfileService extends IsReadyService {
	private userProfile: UserProfile;
	private _passwordHash: string;

	constructor(private userRepository: UserRepository) {
		super();
		this.init();
	}

	public init(): void {
		this.getProfileData().subscribe((data) => {
			this._passwordHash = data['passwordHash'];
			this.userProfile = new UserProfile(data);
			this.setReady(true);
		});
	}

	public setProfilePhotoUrl(url: string): void {
		this.userRepository.setProfilePhoto(url).subscribe();
	}

	get profilePhotoUrl(): string {
		if (!this.userProfile) {
			return '';
		}

		return this.userProfile.profilePhotoUrl;
	}

	get userId(): string {
		if (!this.userProfile) {
			return '';
		}

		return this.userProfile._id;
	}

	get passwordHash(): string {
		if (!this.userProfile) {
			return '';
		}

		return this._passwordHash;
	}

	private getProfileData(): Observable<any> {
		return this.userRepository.getUserProfile();
	}
}
