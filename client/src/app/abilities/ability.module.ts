import { NgModule } from '@angular/core';
import { AddAbilityDialogComponent } from './add-ability-dialog.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
	MatButtonModule,
	MatExpansionModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatTooltipModule
} from '@angular/material';
import { AbilityService } from "./ability.service";
import { CharacterSheetService } from "../character-sheet/sheet/character-sheet.service";
import { AbilitiesComponent } from './abilities.compnent';

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatExpansionModule,
	],
	declarations: [
			AddAbilityDialogComponent,
			AbilitiesComponent,
	],
	entryComponents: [
			AddAbilityDialogComponent,
	],
	providers: [
			AbilityService,
			CharacterSheetService,
	],
	exports: [
			AbilitiesComponent,
	]
})
export class AbilityModule {

}
