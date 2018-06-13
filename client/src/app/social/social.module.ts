import { NgModule } from '@angular/core';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatTableModule } from '@angular/material';
import { SocialRepository } from './social.repository';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocialService } from './social.service';
import { SelectFriendsComponent } from './select-friends/select-friends.component';
import { FriendService } from './friend.service';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatListModule
    ],
    declarations: [
        AddFriendComponent,
        SelectFriendsComponent
    ],
    entryComponents: [
        AddFriendComponent,
        SelectFriendsComponent
    ],
    providers: [
        SocialRepository,
        SocialService,
		    FriendService,
    ],
    exports: [
        AddFriendComponent,
        SelectFriendsComponent
    ]
})
export class SocialModule {

}