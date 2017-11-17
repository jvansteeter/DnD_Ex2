import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket/socket.service';
import { SocketComponent } from './socket/socket.component';
import { UserProfileService } from './utilities/services/userProfile.service';
import { UserProfile } from './types/userProfile';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'web-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends SocketComponent implements OnInit {

    constructor(private router: Router,
                private userProfileService: UserProfileService,
                socketService: SocketService) {
        super(socketService);
        this.userProfileService.getUserProfile().then((userProfile: UserProfile) => {
            this.socketEmit('login', userProfile._id);
        });
    }

    ngOnInit(): void {
        this.router.navigate(['/home']);
        this.socketOn('friendRequest').subscribe(fromUser => {
            console.log('got a friend request')
            console.log(fromUser)
        })
        Observable.timer(5000).subscribe(() => {
            this.socketEmit('requestRequest');
        })
    }
}
