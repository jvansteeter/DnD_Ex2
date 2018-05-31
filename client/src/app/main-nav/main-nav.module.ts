import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatGridListModule, MatIconModule, MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatSortModule,
    MatToolbarModule
} from '@angular/material';
import { MainNavComponent } from './main-nav.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        MatSortModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        AppRoutingModule,
    ],
    declarations: [
        MainNavComponent
    ],
    providers: [
    ],
    exports: [
        MainNavComponent
    ]
})
export class MainNavModule {}