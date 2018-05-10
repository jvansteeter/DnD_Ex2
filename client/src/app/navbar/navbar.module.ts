import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";
import { NotificationComponent } from "../main-nav/notification.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { MatDividerModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatDividerModule
    ],
    declarations: [
        NavbarComponent,
        NotificationComponent,
    ],
    exports: [
        NavbarComponent
    ]
})
export class NavbarModule {

}