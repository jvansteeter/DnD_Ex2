import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { MapMakerModule } from './map-maker/map-maker.module';
import {
	MatButtonModule, MatCardModule, MatGridListModule,
	MatIconModule,
	MatMenuModule, MatPaginatorModule,
	MatTableModule,
	MatTabsModule,
} from '@angular/material';
import { RuleSetModule } from './rule-set/rule-set.module';
import { CharacterSheetModule } from './character-sheet/character-sheet.module';
import { UtilityModule } from './utilities/utility.module';
import { CampaignModule } from './campaign/campaign.module';
import { AlertModule } from './alert/alert.module';
import { EncounterModule } from "./encounter/encounter.module";
import { BoardModule } from "./board/board.module";
import { HttpClientModule } from '@angular/common/http';
import { MainTableComponent } from './main-table/main-table.component';
import { MainNavModule } from './main-nav/main-nav.module';
import { StompRService } from "@stomp/ng2-stompjs";
import { MqService } from './mq/mq.service';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './data-services/chat.service';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
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
		ChatModule,
	],
	declarations: [
		AppComponent,
		MainTableComponent,
	],
	providers: [
		StompRService,
		MqService,
		ChatService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
