import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileService } from './profile/profile.service';
import { MdButtonModule, MdMenuModule, MdTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { MapMakerComponent } from './map-maker/map-maker.component';
import { MapMakerModule } from './map-maker/map-maker.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        MdTabsModule,
        BrowserAnimationsModule,
        MdButtonModule,
        MdMenuModule,
        HomeModule,
        MapMakerModule
    ],
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    providers: [
        ProfileService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
