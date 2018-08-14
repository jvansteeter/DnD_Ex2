import { NgModule } from '@angular/core';
import { RuleSetHomeComponent } from './home/rule-set-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
	MatButtonModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatInputModule, MatListModule,
	MatSelectModule, MatSlideToggleModule,
	MatTableModule
} from '@angular/material';
import { NewCharacterSheetDialogComponent } from './home/dialog/new-character-sheet-dialog.component';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { RuleSetSelectorComponent } from './selector/rule-set-selector.component';
import { AppCDKModule } from '../cdk/cdk.module';
import { ConfigService } from '../data-services/config.service';
import { NewCharacterDialogComponent } from './home/dialog/new-character-dialog.component';

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
		MatSelectModule,
		MatGridListModule,
		AppCDKModule,
		MatSlideToggleModule,
	],
	declarations: [
		RuleSetHomeComponent,
		NewCharacterSheetDialogComponent,
		NewCharacterDialogComponent,
		RuleSetSelectorComponent,
	],
	providers: [
		RuleSetRepository,
		ConfigService,
	],
	exports: [
		RuleSetHomeComponent,
		RuleSetSelectorComponent,
	],
	entryComponents: [
		NewCharacterSheetDialogComponent,
		NewCharacterDialogComponent,
	]
})
export class RuleSetModule {

}