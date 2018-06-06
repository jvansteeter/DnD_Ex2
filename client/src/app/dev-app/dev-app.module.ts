import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {
	MatButtonModule, MatCardModule,
	MatGridListModule,
	MatIconModule, MatMenuModule,
	MatPaginatorModule,
	MatTableModule,
	MatTabsModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from '../home/home.module';
import { MapMakerModule } from '../map-maker/map-maker.module';
import { RuleSetModule } from '../rule-set/rule-set.module';
import { CharacterSheetModule } from '../character-sheet/character-sheet.module';
import { UtilityModule } from '../utilities/utility.module';
import { CampaignModule } from '../campaign/campaign.module';
import { BoardModule } from '../board/board.module';
import { EncounterModule } from '../encounter/encounter.module';
import { AlertModule } from '../alert/alert.module';
import { MainNavModule } from '../main-nav/main-nav.module';
import { DevAppComponent } from './dev-app.component';
import { UserDataService } from '../utilities/user-data/userData.service';
import {EncounterDevService} from '../encounter/encounter-dev.service';
import { EncounterService } from '../encounter/encounter.service';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		MatTabsModule,
		BrowserAnimationsModule,
		MatButtonModule,
		HomeModule,
		MapMakerModule,
		MatIconModule,
		RuleSetModule,
		CharacterSheetModule,
		UtilityModule,
		CampaignModule,
		AlertModule,
		EncounterModule,
		BoardModule,
		MatTableModule,
		MatPaginatorModule,
		MainNavModule,
		// temp dash
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
	],
	declarations: [
		DevAppComponent,
	],
	providers: [
		UserDataService,
		{ provide: EncounterService, useClass: EncounterDevService }
	],
	bootstrap: [ DevAppComponent ]
})
export class DevAppModule {
}
