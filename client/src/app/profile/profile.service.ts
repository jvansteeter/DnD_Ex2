import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Profile } from './profile';


@Injectable()
export class ProfileService {
    private profileData: Observable<any>;

    constructor(private http: Http) {
        this.getProfileData();
    }

    private getProfileData(): void {
        this.profileData = this.http.get('/api/user/profile')
            .map(response => response.json())
            .map(data => new Profile(data))
    }

    public getUsername(): Promise<string> {
        return new Promise<string>((resolve => {
            this.profileData.subscribe((profile: Profile) => {
                resolve(profile.getName());
            });
        }));
    }
}
