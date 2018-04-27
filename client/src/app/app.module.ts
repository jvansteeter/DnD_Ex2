import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { MapMakerModule } from './map-maker/map-maker.module';
import { MatButtonModule, MatIconModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { RuleSetModule } from './rule-set/rule-set.module';
import { CharacterSheetModule } from './character-sheet/character-sheet.module';
import { SocketService } from "./socket/socket.service";
import { UtilityModule } from './utilities/utility.module';
import { CampaignModule } from './campaign/campaign.module';
import { AlertModule } from './alert/alert.module';
import { EncounterModule } from "./encounter/encounter.module";
import {BoardModule} from "./board/board.module";
import { NavbarModule } from "./navbar/navbar.module";
import { HttpClientModule } from '@angular/common/http';
import { UserDataService } from './utilities/user-data/userData.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
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
        NavbarModule
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        SocketService,
        UserDataService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
