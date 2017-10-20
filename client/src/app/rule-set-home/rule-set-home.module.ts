import { NgModule } from '@angular/core';
import { RuleSetHomeComponent } from './rule-set-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatButtonModule, MatDialogModule, MatExpansionModule, MatInputModule, MatListModule,
    MatSelectModule,
    MatTableModule
} from '@angular/material';
import { NewCharacterSheetDialogComponent } from './dialog/new-character-sheet-dialog.component';
import { RuleSetHomeRepository } from './rule-set-home.repository';
import { NewNpcDialogComponent } from './dialog/new-npc-dialog.component';

@NgModule({
    imports: [
        HttpClientModule,
        FormsModule,
        BrowserModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
        MatListModule,
        MatTableModule,
        MatSelectModule
    ],
    declarations: [
        RuleSetHomeComponent,
        NewCharacterSheetDialogComponent,
        NewNpcDialogComponent
    ],
    providers: [
        RuleSetHomeRepository
    ],
    exports: [
        RuleSetHomeComponent
    ],
    entryComponents: [
        NewCharacterSheetDialogComponent,
        NewNpcDialogComponent
    ]
})
export class RuleSetHomeModule {

}