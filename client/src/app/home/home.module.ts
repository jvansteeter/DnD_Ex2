import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatButtonModule, MatExpansionModule, MatInputModule, MatListModule } from '@angular/material';
import { NewRuleSetDialogComponent } from './dialog/new-rule-set-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
        HttpClientModule,
        FormsModule,
        BrowserModule,
        MatListModule
    ],
    declarations: [
        HomeComponent,
        NewRuleSetDialogComponent
    ],
    exports: [
        HomeComponent
    ],
    entryComponents: [
        NewRuleSetDialogComponent
    ]
})
export class HomeModule {

}
