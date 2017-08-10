
import { Component } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
    private username: string;
    private navLinks: any[];

    constructor(private profileService: ProfileService) {
        this.profileService.getUsername().then(username => {
            this.username = username;
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
