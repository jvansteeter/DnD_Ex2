import { NgModule } from '@angular/core';
import { RuleSetHomeComponent } from './rule-set-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatDialogModule, MatExpansionModule, MatInputModule, MatListModule } from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';

@NgModule({
    imports: [
        HttpClientModule,
        FormsModule,
        BrowserModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
        MatListModule
    ],
    declarations: [
        RuleSetHomeComponent,
        NewCharacterSheetDialogComponent
    ],
    exports: [
        RuleSetHomeComponent
    ],
    entryComponents: [
        NewCharacterSheetDialogComponent
    ]
})
export class RuleSetHomeModule {

}