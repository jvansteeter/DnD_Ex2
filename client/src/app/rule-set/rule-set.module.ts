import { NgModule } from '@angular/core';
import { RuleSetHomeComponent } from './home/rule-set-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
	MatButtonModule,
	MatDialogModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatTableModule,
	MatTooltipModule
} from '@angular/material';
import { NewCharacterSheetDialogComponent } from './home/dialog/new-character-sheet-dialog.component';
import { RuleSetRepository } from '../repositories/rule-set.repository';
import { RuleSetSelectorComponent } from './selector/rule-set-selector.component';
import { AppCDKModule } from '../cdk/cdk.module';
import { NewCharacterDialogComponent } from './home/dialog/new-character-dialog.component';
import { NewDamageTypeDialogComponent } from './home/dialog/new-damage-type-dialog.component';
import { SocialModule } from '../social/social.module';
import { ConditionsModule } from '../conditions/conditions.module';
import { ColorPickerModule } from 'ngx-color-picker';

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
		MatMenuModule,
		MatIconModule,
		MatTooltipModule,
		SocialModule,
		ConditionsModule,
			ColorPickerModule,
	],
	declarations: [
		RuleSetHomeComponent,
		NewCharacterSheetDialogComponent,
		NewCharacterDialogComponent,
		RuleSetSelectorComponent,
		NewDamageTypeDialogComponent,
	],
	providers: [
		RuleSetRepository,
	],
	exports: [
		RuleSetHomeComponent,
		RuleSetSelectorComponent,
	],
	entryComponents: [
		NewCharacterSheetDialogComponent,
		NewCharacterDialogComponent,
		NewDamageTypeDialogComponent,
	]
})
export class RuleSetModule {

}