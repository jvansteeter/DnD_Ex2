import { Component } from '@angular/core';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { UserProfile } from '../types/userProfile';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
    private username: string;
    private navLinks: any[];

    constructor(private profileService: UserProfileService) {
        this.profileService.getUserProfile().then((userProfile: UserProfile) => {
            this.username = userProfile.getName();
            this.navLinks = [
                {
                    label: 'Home',
                    route: 'home'
                },
                {
                    label: 'Map Maker',
                    route: 'map-maker'
                }
            ];
        });
    }
}
