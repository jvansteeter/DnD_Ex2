import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatExpansionModule,
	MatGridListModule, MatIconModule,
	MatInputModule,
	MatListModule, MatMenuModule, MatPaginatorModule,
	MatTableModule
} from '@angular/material';
import { SocialModule } from '../social/social.module';
import { CampaignRepository } from '../repositories/campaign.repository';
import { NewEncounterDialogComponent } from './dialog/new-encounter-dialog.component';
import { UtilityModule } from '../utilities/utility.module';
import { AppCDKModule } from '../cdk/cdk.module';
import { CampaignPageService } from './campaign-page.service';


@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		MatListModule,
		MatButtonModule,
		MatExpansionModule,
		MatTableModule,
		MatCheckboxModule,
		SocialModule,
		MatDialogModule,
		MatInputModule,
		MatGridListModule,
		MatCardModule,
		MatPaginatorModule,
		UtilityModule,
		MatMenuModule,
		MatIconModule,
		AppCDKModule,
	],
	declarations: [
		CampaignComponent,
		NewEncounterDialogComponent
	],
	exports: [
		CampaignComponent
	],
	entryComponents: [
		NewEncounterDialogComponent
	],
	providers: [
		CampaignRepository,
		CampaignPageService,
	]
})
export class CampaignModule {

}