import { Injectable } from '@angular/core';
import { UserProfile } from '../../types/userProfile';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UserProfileService {
    public userProfile: UserProfile;
    private profilePromise: Promise<void>;

    constructor(private http: HttpClient) {
        this.profilePromise = this.getProfileData();
    }

    public getUserProfile(): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
            this.profilePromise.then(() => {
                resolve(this.userProfile);
            }).catch(error => reject(error));
        });
    }

    public getProfilePhotoUrl(): string | undefined {
        if (this.userProfile) {
            return this.userProfile.profilePhotoUrl;
        }
    }

    public setProfilePhotoUrl(url: string): void {

    }

    private getProfileData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.get('/api/user/profile', {responseType: 'json'}).subscribe((data) => {
                console.log('getProfileData')
                console.log(data)
                this.userProfile = new UserProfile(data);
                resolve();
            }, error => reject(error));
        });
    }
}
