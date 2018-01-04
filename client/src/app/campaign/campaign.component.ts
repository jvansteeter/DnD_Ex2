import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Subject } from 'rxjs/Subject';
import { SubjectDataSource } from '../utilities/subjectDataSource';
import { UserProfile } from '../types/userProfile';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../alert/alert.service';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { MatDialog } from '@angular/material';
import { SelectFriendsComponent } from '../social/select-friends/select-friends.component';


@Component({
    selector: 'campaign-page',
    templateUrl: 'campaign.component.html',
    styleUrls: ['campaign.component.css']
})
export class CampaignComponent implements OnInit {
    private campaignId;
    private campaign;
    private members: any[];

    private gameMasterDataSource: SubjectDataSource<UserProfile>;
    private gameMasterSubject: Subject<UserProfile[]>;
    public gameMasterColumns = ['users', 'gm'];

    constructor(private activatedRoute: ActivatedRoute,
                private campaignRepository: CampaignRepository,
                private alertService: AlertService,
                private userProfileService: UserProfileService,
                private dialog: MatDialog){
        this.gameMasterSubject = new Subject<UserProfile[]>();
        this.gameMasterDataSource = new SubjectDataSource<UserProfile>(this.gameMasterSubject);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.campaignId = params['campaignId'];
            this.campaignRepository.getCampaign(this.campaignId).subscribe((campaign: any) => {
                this.campaign = campaign;
            });
            this.campaignRepository.getCampaignMembers(this.campaignId).subscribe(members => {
                this.members = members;
                this.gameMasterSubject.next(members);
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
        this.dialog.open(SelectFriendsComponent);
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
