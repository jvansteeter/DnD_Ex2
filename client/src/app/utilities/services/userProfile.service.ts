import { Injectable } from '@angular/core';
import { UserProfile } from '../../types/userProfile';
import { HttpClient } from '@angular/common/http';
import { SocialService } from "../../social/social.service";


@Injectable()
export class UserProfileService {
    public userProfile: UserProfile;
    private profilePromise: Promise<void>;

    public friends: UserProfile[];

    constructor(private http: HttpClient,
                private socialService: SocialService) {
        this.profilePromise = this.getProfileData();
    }

    public getUserProfile(): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
            this.profilePromise.then(() => {
                resolve(this.userProfile);
            }).catch(error => reject(error));
        });
    }

    public getProfilePhotoUrl(): string {
        if (this.userProfile) {
            return this.userProfile.profilePhotoUrl;
        }

        return '';
    }

    public getUserId(): string {
        if (this.userProfile) {
            return this.userProfile._id;
        }

        return '';
    }

    public setProfilePhotoUrl(url: string): void {
        this.http.post('api/user/profilephoto', {imageUrl: url}, {responseType: 'text'}).subscribe();
    }

    public getFriends(): void {
        this.socialService.getFriends().subscribe((friends: UserProfile[]) => {
            console.log('these are my friends')
            console.log(friends)
            this.friends = friends;
        });
    }

    private getProfileData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.get('/api/user/profile', {responseType: 'json'}).subscribe((data) => {
                this.userProfile = new UserProfile(data);
                resolve();
            }, error => reject(error));
        });
    }
}
