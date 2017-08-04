
import { Component } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
    private username: string;

    constructor(private profileService: ProfileService) {
        this.profileService.getUsername().then(username => {
            this.username = username;
        });
    }
}
