import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileService } from './profile/profile.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
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
