import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileService } from './utilities/services/userProfile.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { MapMakerModule } from './map-maker/map-maker.module';
import { MatButtonModule, MatIconModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { RuleSetHomeModule } from './rule-set-home/rule-set-home.module';
import { CharacterSheetModule } from './character-sheet/character-sheet.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
        HomeModule,
        MapMakerModule,
        MatIconModule,
        RuleSetHomeModule,
        CharacterSheetModule
    ],
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    providers: [
        UserProfileService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
