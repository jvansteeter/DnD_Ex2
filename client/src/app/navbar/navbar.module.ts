import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";
import { NotificationComponent } from "./notification.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconModule, MatMenuModule } from '@angular/material';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MatMenuModule,
        MatIconModule
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