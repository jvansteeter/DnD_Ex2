import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { SubjectDataSource } from '../utilities/subjectDataSource';
import { UserProfile } from '../types/userProfile';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../alert/alert.service';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SelectFriendsComponent } from '../social/select-friends/select-friends.component';
import { CampaignService } from './campaign.service';


@Component({
    selector: 'campaign-page',
    templateUrl: 'campaign.component.html',
    styleUrls: ['campaign.component.css']
})
export class CampaignComponent implements OnInit {
    private campaignId;
    private campaign;
    private members: any[];

    private gameMasterDataSource: MatTableDataSource<any>;
    public gameMasterColumns = ['users', 'gm'];

    constructor(private activatedRoute: ActivatedRoute,
                private campaignService: CampaignService,
                private alertService: AlertService,
                private userProfileService: UserProfileService,
                private dialog: MatDialog){
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.campaignId = params['campaignId'];
            this.campaignService.setCampaignId(this.campaignId);
            this.campaignService.isReady().subscribe((isReady: boolean) => {
                if (isReady) {
                    this.campaign = this.campaignService.campaign;
                    this.members = this.campaignService.members;
                    this.gameMasterDataSource = new MatTableDataSource(this.members);
                }
            });
        });
    }

    changeGameMaster(member: any): void {
        // make sure there is at least one game master left
        let remainingMaster = false;
        for (let i = 0; i < this.members.length; i++) {
            remainingMaster = remainingMaster || this.members[i].gameMaster;
        }
        if (!remainingMaster) {
            Observable.timer(100).subscribe(() => {
                member.gameMaster = true;
            });
            this.alertService.showAlert('There must be at least one game master');
        }
    }

    inviteFriends(): void {
        let dialogRef = this.dialog.open(SelectFriendsComponent);
        dialogRef.componentInstance.friendsSelected.subscribe((friends: UserProfile[]) => {
            console.log('successfully subscribed to selection events')
            console.log(friends)
        });
    }

    isGameMaster(): boolean {
        for (let i = 0; i < this.members.length; i++) {
            if (this.userProfileService.getUserId() === this.members[i]._id) {
                return this.members[i].gameMaster;
            }
        }

        return false;
    }
}
