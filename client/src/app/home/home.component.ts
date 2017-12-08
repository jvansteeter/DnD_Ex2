import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { Router } from '@angular/router';
import { UserProfileService } from '../utilities/services/userProfile.service';
import { HomeRepository } from './home.repository';
import { Subject } from 'rxjs/Subject';
import { SubjectDataSource } from '../utilities/subjectDataSource';


@Component({
    selector: 'home-page',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    private reader: FileReader = new FileReader();
    private profilePhotoUrl: string = '';

    public ruleSets: any[];
    private ruleSetSubject: Subject<any>;
    private ruleSetDataSource: SubjectDataSource;

    public campaigns: any[];
    private campaignSubject: Subject<any>;
    private campaignDataSource: SubjectDataSource;

    constructor(private dialog: MatDialog,
                private router: Router,
                private userProfileService: UserProfileService,
                private homeRepository: HomeRepository) {
        this.userProfileService.getUserProfile().then(() => {
            this.profilePhotoUrl = this.userProfileService.getProfilePhotoUrl();
        });
        this.ruleSetSubject = new Subject<any>();
        this.ruleSetDataSource = new SubjectDataSource(this.ruleSetSubject);

        this.campaignSubject = new Subject<any>();
        this.campaignDataSource = new SubjectDataSource(this.campaignSubject);
    }

    public ngOnInit(): void {
        this.getRuleSets();
        this.getCampaigns();
    }

    public newRuleSet(): void {
        this.dialog.open(NewRuleSetDialogComponent);
    }

    public ruleSetHome(ruleSetId: string): void {
        this.router.navigate(['/rule-set', ruleSetId]);
    }

    public upload(): void {
        this.fileInput.nativeElement.click();
    }

    public loadImage(): void {
        this.reader.addEventListener('load', () => {
            this.profilePhotoUrl = this.reader.result;
            this.userProfileService.setProfilePhotoUrl(this.profilePhotoUrl);
        });
        if (this.fileInput.nativeElement.files[0]) {
            this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
        }
    }

    private getRuleSets(): void {
        this.homeRepository.getRuleSets().subscribe((ruleSets: any) => {
            this.ruleSets = ruleSets;
        });
    }

    private getCampaigns(): void {
        this.homeRepository.getCampaigns().subscribe((campaigns: any[]) => {
            this.campaigns = campaigns;
            this.campaignSubject.next(campaigns);
        });
    }
}
