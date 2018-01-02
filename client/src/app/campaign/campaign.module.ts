import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatButtonModule, MatCheckboxModule, MatExpansionModule, MatListModule,
    MatTableModule
} from '@angular/material';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        MatListModule,
        MatButtonModule,
        MatExpansionModule,
        MatTableModule,
        MatCheckboxModule
    ],
    declarations: [
        CampaignComponent
    ],
    exports: [
        CampaignComponent
    ],
    providers: [

    ]
})
export class CampaignModule {

}